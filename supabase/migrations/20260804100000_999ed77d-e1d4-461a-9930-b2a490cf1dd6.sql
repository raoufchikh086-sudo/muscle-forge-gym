-- ENUMS
CREATE TYPE public.app_role AS ENUM ('member','coach','admin');
CREATE TYPE public.training_env AS ENUM ('gym','home_equipment','calisthenics');
CREATE TYPE public.level AS ENUM ('beginner','intermediate','advanced');
CREATE TYPE public.goal AS ENUM ('mass','strength','cut','endurance');

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  age INT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  goal public.goal,
  experience public.level,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles readable by authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- new user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member') ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- BODY STATS
CREATE TABLE public.body_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_on DATE NOT NULL DEFAULT current_date,
  weight_kg NUMERIC,
  body_fat_pct NUMERIC,
  chest_cm NUMERIC,
  arm_cm NUMERIC,
  waist_cm NUMERIC,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.body_stats TO authenticated;
GRANT ALL ON public.body_stats TO service_role;
ALTER TABLE public.body_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own body stats" ON public.body_stats FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PROGRAMS
CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  environment public.training_env NOT NULL,
  level public.level NOT NULL,
  goal public.goal NOT NULL,
  weeks INT NOT NULL DEFAULT 8,
  days_per_week INT NOT NULL DEFAULT 4,
  equipment TEXT,
  image_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.programs TO anon, authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "programs public read" ON public.programs FOR SELECT USING (true);

CREATE TABLE public.program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title TEXT NOT NULL,
  focus TEXT,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  UNIQUE (program_id, day_number)
);
GRANT SELECT ON public.program_days TO anon, authenticated;
GRANT ALL ON public.program_days TO service_role;
ALTER TABLE public.program_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "program days public read" ON public.program_days FOR SELECT USING (true);

-- PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  image_key TEXT,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (true);

-- ORDERS
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total_cents INT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  provider_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own orders read" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own orders insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price_cents INT NOT NULL
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own order items read" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "own order items insert" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));

-- SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own subscription read" ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER subs_updated BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CHAT
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  topic TEXT NOT NULL DEFAULT 'Coaching',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conversation participants read" ON public.conversations FOR SELECT TO authenticated
  USING (auth.uid() = member_id OR auth.uid() = coach_id OR public.has_role(auth.uid(),'coach'));
CREATE POLICY "member creates conversation" ON public.conversations FOR INSERT TO authenticated WITH CHECK (auth.uid() = member_id);
CREATE POLICY "participants update conversation" ON public.conversations FOR UPDATE TO authenticated
  USING (auth.uid() = member_id OR auth.uid() = coach_id OR public.has_role(auth.uid(),'coach'));
CREATE TRIGGER convo_updated BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages participants read" ON public.messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id
    AND (c.member_id = auth.uid() OR c.coach_id = auth.uid() OR public.has_role(auth.uid(),'coach'))));
CREATE POLICY "messages participants insert" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id
    AND (c.member_id = auth.uid() OR c.coach_id = auth.uid() OR public.has_role(auth.uid(),'coach'))));
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- QUOTES
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  context TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0
);
GRANT SELECT ON public.quotes TO anon, authenticated;
GRANT ALL ON public.quotes TO service_role;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotes public read" ON public.quotes FOR SELECT USING (true);

-- SEED PROGRAMS
INSERT INTO public.programs (slug,title,summary,environment,level,goal,weeks,days_per_week,equipment,image_key) VALUES
('iron-foundation','Iron Foundation','A full gym push/pull/legs base builder for anyone who wants real size and clean technique.','gym','beginner','mass',8,4,'Barbell, dumbbells, cable machine','gym'),
('heavy-metal-strength','Heavy Metal Strength','Low-rep, high-intent barbell strength cycle built around squat, bench, deadlift and press.','gym','advanced','strength',12,4,'Power rack, barbell, plates','gym'),
('shred-protocol','Shred Protocol','Hypertrophy work paired with conditioning finishers to strip fat while holding muscle.','gym','intermediate','cut',6,5,'Full gym, treadmill or bike','gym'),
('home-machine-mass','Home Machine Mass','Built for a home setup with adjustable bench, dumbbells and a multi-station machine.','home_equipment','beginner','mass',8,4,'Dumbbells, bench, home machine','home'),
('garage-power','Garage Power','Serious strength in a garage gym: heavy compounds, minimal equipment, no excuses.','home_equipment','advanced','strength',10,4,'Barbell, rack, adjustable dumbbells','home'),
('kettlebell-engine','Kettlebell Engine','Conditioning-first plan using one or two kettlebells to build a brutal engine.','home_equipment','intermediate','endurance',6,5,'Kettlebell 16-24kg','home'),
('zero-equipment-base','Zero Equipment Base','Pure bodyweight foundation: push-ups, squats, rows on anything, planks and progressions.','calisthenics','beginner','endurance',6,4,'None','calisthenics'),
('street-workout-skills','Street Workout Skills','Muscle-up, front lever and handstand progressions with the strength work to support them.','calisthenics','advanced','strength',12,5,'Pull-up bar, parallel bars','calisthenics'),
('bodyweight-shred','Bodyweight Shred','High-density circuits with zero equipment to burn fat anywhere in the world.','calisthenics','intermediate','cut',6,5,'None','calisthenics');

INSERT INTO public.program_days (program_id, day_number, title, focus, exercises)
SELECT p.id, d.day_number, d.title, d.focus, d.exercises::jsonb
FROM public.programs p
JOIN (VALUES
 (1,'Push','Chest, shoulders, triceps','[{"name":"Barbell bench press","sets":"4","reps":"6-8","rest":"2-3 min","note":"Control the eccentric, touch the chest."},{"name":"Seated dumbbell press","sets":"3","reps":"8-10","rest":"90s","note":"Full lockout, no lower-back arch."},{"name":"Incline dumbbell press","sets":"3","reps":"10-12","rest":"90s","note":"30 degree bench."},{"name":"Cable fly","sets":"3","reps":"12-15","rest":"60s","note":"Squeeze one second at the front."},{"name":"Triceps rope pushdown","sets":"3","reps":"12-15","rest":"60s","note":"Elbows pinned."}]'),
 (2,'Pull','Back and biceps','[{"name":"Deadlift","sets":"4","reps":"5","rest":"3 min","note":"Neutral spine, drive the floor away."},{"name":"Pull-up or lat pulldown","sets":"4","reps":"6-10","rest":"2 min","note":"Full stretch at the top."},{"name":"Barbell row","sets":"3","reps":"8-10","rest":"2 min","note":"Torso at 45 degrees."},{"name":"Face pull","sets":"3","reps":"15","rest":"60s","note":"Pull to the forehead."},{"name":"Barbell curl","sets":"3","reps":"10-12","rest":"60s","note":"No swing."}]'),
 (3,'Legs','Quads, hamstrings, glutes','[{"name":"Back squat","sets":"4","reps":"6-8","rest":"3 min","note":"Depth over ego."},{"name":"Romanian deadlift","sets":"3","reps":"8-10","rest":"2 min","note":"Feel the hamstring stretch."},{"name":"Leg press","sets":"3","reps":"10-12","rest":"90s","note":"Do not lock knees hard."},{"name":"Walking lunge","sets":"3","reps":"12 each leg","rest":"90s","note":"Long stride."},{"name":"Standing calf raise","sets":"4","reps":"15","rest":"45s","note":"Pause at the top."}]'),
 (4,'Upper accessory + core','Arms, delts, midsection','[{"name":"Incline dumbbell curl","sets":"3","reps":"12","rest":"60s","note":"Slow negative."},{"name":"Lateral raise","sets":"4","reps":"15","rest":"45s","note":"Lead with the elbow."},{"name":"Skullcrusher","sets":"3","reps":"12","rest":"60s","note":"Elbows still."},{"name":"Hanging leg raise","sets":"3","reps":"12-15","rest":"60s","note":"No swinging."},{"name":"Plank","sets":"3","reps":"60s","rest":"45s","note":"Ribs down, glutes tight."}]')
) AS d(day_number,title,focus,exercises) ON p.slug = 'iron-foundation';

INSERT INTO public.program_days (program_id, day_number, title, focus, exercises)
SELECT p.id, d.day_number, d.title, d.focus, d.exercises::jsonb
FROM public.programs p
JOIN (VALUES
 (1,'Squat day','Max strength lower','[{"name":"Back squat","sets":"5","reps":"3","rest":"4 min","note":"80-87% of max."},{"name":"Pause squat","sets":"3","reps":"3","rest":"3 min","note":"2 second pause in the hole."},{"name":"Romanian deadlift","sets":"3","reps":"6","rest":"2 min","note":"Heavy but clean."},{"name":"Weighted plank","sets":"3","reps":"45s","rest":"60s","note":"Brace hard."}]'),
 (2,'Bench day','Max strength press','[{"name":"Bench press","sets":"5","reps":"3","rest":"4 min","note":"Leg drive, tight upper back."},{"name":"Close-grip bench","sets":"3","reps":"6","rest":"3 min","note":"Elbows tucked."},{"name":"Weighted dip","sets":"3","reps":"6-8","rest":"2 min","note":"Slight forward lean."},{"name":"Barbell row","sets":"4","reps":"6","rest":"2 min","note":"Build the pressing base."}]'),
 (3,'Deadlift day','Posterior chain','[{"name":"Deadlift","sets":"5","reps":"2","rest":"4 min","note":"85-90%, reset each rep."},{"name":"Deficit deadlift","sets":"3","reps":"4","rest":"3 min","note":"2.5cm deficit."},{"name":"Barbell shrug","sets":"3","reps":"10","rest":"90s","note":"Hold at the top."},{"name":"Weighted pull-up","sets":"4","reps":"5","rest":"2 min","note":"Dead hang start."}]'),
 (4,'Overhead day','Shoulders and lockout','[{"name":"Standing press","sets":"5","reps":"3","rest":"3 min","note":"No hip drive."},{"name":"Push press","sets":"3","reps":"5","rest":"3 min","note":"Dip and drive."},{"name":"Lateral raise","sets":"4","reps":"12","rest":"60s","note":"Strict."},{"name":"Face pull","sets":"3","reps":"15","rest":"60s","note":"Shoulder health."}]')
) AS d(day_number,title,focus,exercises) ON p.slug = 'heavy-metal-strength';

INSERT INTO public.program_days (program_id, day_number, title, focus, exercises)
SELECT p.id, d.day_number, d.title, d.focus, d.exercises::jsonb
FROM public.programs p
JOIN (VALUES
 (1,'Full body A','Total body bodyweight','[{"name":"Push-up","sets":"4","reps":"10-20","rest":"75s","note":"Elbows 45 degrees."},{"name":"Bodyweight squat","sets":"4","reps":"20","rest":"60s","note":"Heels flat."},{"name":"Table row or towel row","sets":"4","reps":"10-15","rest":"75s","note":"Chest to the edge."},{"name":"Reverse lunge","sets":"3","reps":"12 each","rest":"60s","note":"Slow and controlled."},{"name":"Plank","sets":"3","reps":"45s","rest":"45s","note":"Straight line."}]'),
 (2,'Core and conditioning','Midsection + heart','[{"name":"Mountain climbers","sets":"4","reps":"40s","rest":"40s","note":"Hips low."},{"name":"Hollow hold","sets":"4","reps":"30s","rest":"45s","note":"Lower back pressed down."},{"name":"Burpee","sets":"5","reps":"10","rest":"60s","note":"Full chest to floor."},{"name":"Side plank","sets":"3","reps":"40s each","rest":"30s","note":"Stack the hips."}]'),
 (3,'Full body B','Push and legs emphasis','[{"name":"Decline push-up","sets":"4","reps":"10-15","rest":"75s","note":"Feet on a chair."},{"name":"Bulgarian split squat","sets":"3","reps":"12 each","rest":"75s","note":"Rear foot elevated."},{"name":"Pike push-up","sets":"3","reps":"8-12","rest":"75s","note":"Shoulder builder."},{"name":"Glute bridge","sets":"3","reps":"20","rest":"45s","note":"Squeeze at the top."},{"name":"Wall sit","sets":"3","reps":"45s","rest":"45s","note":"Thighs parallel."}]'),
 (4,'Skill and mobility','Handstand prep and recovery','[{"name":"Wall handstand hold","sets":"4","reps":"30s","rest":"60s","note":"Chest to wall."},{"name":"Scapular push-up","sets":"3","reps":"12","rest":"45s","note":"Protract and retract."},{"name":"Deep squat hold","sets":"3","reps":"60s","rest":"45s","note":"Elbows push knees out."},{"name":"Couch stretch","sets":"2","reps":"60s each","rest":"30s","note":"Hip flexor release."}]')
) AS d(day_number,title,focus,exercises) ON p.slug = 'zero-equipment-base';

-- SEED PRODUCTS
INSERT INTO public.products (slug,name,category,description,price_cents,image_key) VALUES
('power-rack-pro','Power Rack Pro','machines','Heavy 11-gauge steel rack with pull-up bar, safety arms and plate storage. The centre of any serious home gym.',89900,'rack'),
('cable-crossover-station','Cable Crossover Station','machines','Dual-column cable station with adjustable pulleys for chest, back, arms and cable core work.',149900,'machine'),
('leg-press-45','45° Leg Press','machines','Plate-loaded leg press with a wide non-slip platform and linear bearings for smooth heavy work.',179900,'machine'),
('olympic-barbell-20kg','Olympic Barbell 20kg','weights','Dual-knurled 20kg bar rated to 700kg with hard chrome sleeves and needle bearings.',34900,'barbell'),
('bumper-plate-set','Bumper Plate Set 100kg','weights','Colour-coded rubber bumper plates: 2x25, 2x20, 2x10, 2x5kg. Drop them without guilt.',59900,'plates'),
('adjustable-dumbbells','Adjustable Dumbbells 2-32kg','weights','One pair replaces fifteen. Dial-in weight changes in two seconds for home training.',54900,'dumbbell'),
('pull-up-bar-wall','Wall-Mounted Pull-Up Bar','calisthenics','Multi-grip steel bar bolted to the wall, rated 250kg. Wide, neutral and close grips.',12900,'bar'),
('wooden-gymnastic-rings','Wooden Gymnastic Rings','calisthenics','28mm birch rings with 4.5m numbered straps. Muscle-ups, dips, rows and ring push-ups.',7900,'rings'),
('parallettes-pro','Parallettes Pro','calisthenics','Low parallettes for L-sits, handstand push-ups and planche work. Wrist-friendly hardwood.',8900,'parallettes'),
('lifting-belt-10mm','10mm Leather Lifting Belt','accessories','Full-grain leather belt with a double-prong buckle for maximum bracing under heavy loads.',9900,'belt'),
('lifting-straps','Figure-8 Lifting Straps','accessories','Heavy-duty cotton straps that stop grip failing before your back does.',2400,'straps'),
('chalk-block','Gym Chalk Block','accessories','Pure magnesium carbonate. Dry hands, zero slip.',900,'chalk'),
('whey-isolate-2kg','Whey Isolate 2kg','supplements','27g protein per scoop, low lactose, mixes clean. Chocolate or vanilla.',6900,'whey'),
('creatine-mono-500g','Creatine Monohydrate 500g','supplements','Micronised creatine monohydrate. The most researched strength supplement on earth.',2900,'creatine'),
('pre-workout-savage','Pre-Workout SAVAGE','supplements','Caffeine, citrulline and beta-alanine for the sessions you do not feel like starting.',3900,'preworkout');

-- SEED QUOTES
INSERT INTO public.quotes (author,text,context,featured,sort_order) VALUES
('David Goggins','You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.','Can''t Hurt Me',true,1),
('David Goggins','Motivation is crap. Motivation comes and goes. When you are driven, whatever is in front of you will get destroyed.','On discipline',true,2),
('David Goggins','When you think you are done, you are only at 40 percent of what your body is capable of.','The 40% rule',true,3),
('David Goggins','Suffering is the true test of life.','Navy SEAL training',true,4),
('David Goggins','Don''t stop when you''re tired. Stop when you''re done.','Training mantra',true,5),
('Khabib Nurmagomedov','If you want to be a champion, you must be ready to suffer more than anyone else.','On preparation',true,6),
('Khabib Nurmagomedov','I never give up. I always come forward. This is my style.','Fight philosophy',true,7),
('Khabib Nurmagomedov','Hard work always beats talent when talent doesn''t work hard.','On discipline',true,8),
('Khabib Nurmagomedov','My father taught me: it is not about how strong you are, it is about how disciplined you are.','On his father Abdulmanap',true,9),
('Khabib Nurmagomedov','Everything is possible if you have belief and you work.','Post-fight',true,10),
('Arnold Schwarzenegger','The last three or four reps is what makes the muscle grow.','Pumping Iron',false,11),
('Ronnie Coleman','Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weight.','Gym legend',false,12);