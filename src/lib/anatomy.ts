export type AnatomySide = "front" | "back";

export type MuscleRegion = {
  id: string;
  name: string;
  latin: string;
  side: AnatomySide;
  /** SVG shapes on a 240 x 520 viewBox */
  shapes: { d: string }[];
  function: string;
  bestExercises: string[];
  trainingNote: string;
};

export const muscleRegions: MuscleRegion[] = [
  {
    id: "chest",
    name: "Chest",
    latin: "Pectoralis major",
    side: "front",
    shapes: [
      { d: "M120 132 C104 126 88 128 80 140 C74 152 78 168 92 174 C106 180 118 172 120 160 Z" },
      { d: "M120 132 C136 126 152 128 160 140 C166 152 162 168 148 174 C134 180 122 172 120 160 Z" },
    ],
    function: "Brings the upper arm across and in front of the body, and presses it away from the torso.",
    bestExercises: ["Barbell bench press", "Dumbbell bench press", "Parallel bar dip", "Push-up"],
    trainingNote: "Train it at long muscle length — deep stretch on the bottom of presses and flyes drives most of the growth.",
  },
  {
    id: "shoulders-front",
    name: "Shoulders",
    latin: "Deltoideus",
    side: "front",
    shapes: [
      { d: "M80 138 C68 132 58 140 58 154 C58 166 66 174 76 172 C82 162 80 148 80 138 Z" },
      { d: "M160 138 C172 132 182 140 182 154 C182 166 174 174 164 172 C158 162 160 148 160 138 Z" },
    ],
    function: "Raises the arm in every direction — front, side and rear heads.",
    bestExercises: ["Standing overhead press", "Dumbbell lateral raise", "Pike push-up", "Band face pull"],
    trainingNote: "Front delts get plenty from pressing; side and rear heads need dedicated isolation two to three times a week.",
  },
  {
    id: "biceps",
    name: "Biceps",
    latin: "Biceps brachii",
    side: "front",
    shapes: [
      { d: "M62 176 C54 180 52 200 58 216 C64 226 74 224 76 214 C78 198 72 182 62 176 Z" },
      { d: "M178 176 C186 180 188 200 182 216 C176 226 166 224 164 214 C162 198 168 182 178 176 Z" },
    ],
    function: "Bends the elbow and supinates the forearm; the long head also assists shoulder flexion.",
    bestExercises: ["Chin-up", "Dumbbell biceps curl", "Barbell bent-over row", "Band curl"],
    trainingNote: "Six to ten hard sets a week is plenty when you already row and pull heavy.",
  },
  {
    id: "abs",
    name: "Abdominals",
    latin: "Rectus abdominis & obliquus",
    side: "front",
    shapes: [
      { d: "M100 182 L140 182 L142 250 C142 262 132 268 120 268 C108 268 98 262 98 250 Z" },
    ],
    function: "Flexes the spine, resists extension and rotation, and transmits force between hips and ribs.",
    bestExercises: ["Hanging leg raise", "Hollow body hold", "Ab wheel rollout", "Cable crunch"],
    trainingNote: "Train them with load and progression like any muscle — visibility, though, comes from body fat.",
  },
  {
    id: "quads",
    name: "Quadriceps",
    latin: "Quadriceps femoris",
    side: "front",
    shapes: [
      { d: "M100 272 C88 278 84 316 90 352 C94 372 108 374 112 356 C116 326 112 292 100 272 Z" },
      { d: "M140 272 C152 278 156 316 150 352 C146 372 132 374 128 356 C124 326 128 292 140 272 Z" },
    ],
    function: "Extends the knee and, via rectus femoris, flexes the hip.",
    bestExercises: ["Barbell back squat", "Leg press", "Bulgarian split squat", "Goblet squat"],
    trainingNote: "Depth matters more than load — a deep squat beats a heavy quarter rep for growth.",
  },
  {
    id: "calves-front",
    name: "Calves & shins",
    latin: "Gastrocnemius · Tibialis anterior",
    side: "front",
    shapes: [
      { d: "M96 380 C88 392 88 420 96 440 C104 452 112 448 112 436 C112 414 108 392 96 380 Z" },
      { d: "M144 380 C152 392 152 420 144 440 C136 452 128 448 128 436 C128 414 132 392 144 380 Z" },
    ],
    function: "Plantar-flexes the ankle for every step, jump and sprint; the tibialis lifts the foot.",
    bestExercises: ["Standing calf raise", "Seated calf raise", "Jump rope", "Tibialis raise"],
    trainingNote: "High frequency and a full stretch at the bottom — three to five sessions a week is not too much.",
  },
  {
    id: "traps",
    name: "Trapezius",
    latin: "Trapezius",
    side: "back",
    shapes: [
      { d: "M120 116 L92 138 L100 190 L120 200 L140 190 L148 138 Z" },
    ],
    function: "Elevates, retracts and rotates the shoulder blades; stabilises the neck under load.",
    bestExercises: ["Barbell shrug", "Conventional deadlift", "Cable face pull", "Farmer carry"],
    trainingNote: "Heavy carries and deadlifts build the traps as much as any direct shrug work.",
  },
  {
    id: "lats",
    name: "Lats",
    latin: "Latissimus dorsi",
    side: "back",
    shapes: [
      { d: "M96 150 C80 158 74 196 88 232 C96 250 112 246 114 228 L114 168 Z" },
      { d: "M144 150 C160 158 166 196 152 232 C144 250 128 246 126 228 L126 168 Z" },
    ],
    function: "Pulls the upper arm down and back — the muscle behind width and every pull-up.",
    bestExercises: ["Pull-up", "Lat pulldown", "Single-arm dumbbell row", "Front lever progression"],
    trainingNote: "Think elbows to the pockets, not hands to the bar; a full overhead stretch every rep.",
  },
  {
    id: "rear-delts",
    name: "Rear delts",
    latin: "Deltoideus posterior",
    side: "back",
    shapes: [
      { d: "M80 140 C66 136 58 146 60 158 C62 168 72 172 80 166 Z" },
      { d: "M160 140 C174 136 182 146 180 158 C178 168 168 172 160 166 Z" },
    ],
    function: "Pulls the upper arm backward and rotates the shoulder externally.",
    bestExercises: ["Band face pull", "Dumbbell rear delt fly", "Barbell bent-over row", "Reverse pec deck"],
    trainingNote: "The most under-trained head. Light weight, high reps, strict tempo, three times a week.",
  },
  {
    id: "triceps",
    name: "Triceps",
    latin: "Triceps brachii",
    side: "back",
    shapes: [
      { d: "M64 174 C54 182 52 204 60 218 C68 228 78 222 78 210 C78 194 72 180 64 174 Z" },
      { d: "M176 174 C186 182 188 204 180 218 C172 228 162 222 162 210 C162 194 168 180 176 174 Z" },
    ],
    function: "Extends the elbow; the long head also pulls the arm back from overhead.",
    bestExercises: ["Parallel bar dip", "Close-grip bench press", "Overhead triceps extension", "Chair triceps dip"],
    trainingNote: "Two thirds of your arm is triceps — train the long head with overhead work.",
  },
  {
    id: "lower-back",
    name: "Lower back",
    latin: "Erector spinae",
    side: "back",
    shapes: [
      { d: "M104 232 L136 232 L134 272 L106 272 Z" },
    ],
    function: "Extends and stabilises the spine against flexion under load.",
    bestExercises: ["Conventional deadlift", "Romanian deadlift", "Back extension", "Good morning"],
    trainingNote: "Strong, not fragile — but respect fatigue: heavy spinal work needs 48 hours to recover.",
  },
  {
    id: "glutes",
    name: "Glutes",
    latin: "Gluteus maximus · medius",
    side: "back",
    shapes: [
      { d: "M120 274 C104 274 92 284 92 300 C92 316 104 324 120 324 C136 324 148 316 148 300 C148 284 136 274 120 274 Z" },
    ],
    function: "Extends the hip and stabilises the pelvis — the engine of sprinting and jumping.",
    bestExercises: ["Barbell hip thrust", "Bulgarian split squat", "Romanian deadlift", "Glute bridge"],
    trainingNote: "Hit them both stretched (RDLs, deep squats) and shortened (thrusts, bridges).",
  },
  {
    id: "hamstrings",
    name: "Hamstrings",
    latin: "Biceps femoris · Semitendinosus",
    side: "back",
    shapes: [
      { d: "M100 330 C90 340 90 372 98 396 C104 412 116 408 116 394 C116 368 110 342 100 330 Z" },
      { d: "M140 330 C150 340 150 372 142 396 C136 412 124 408 124 394 C124 368 130 342 140 330 Z" },
    ],
    function: "Bends the knee and extends the hip; critical for sprint speed and knee health.",
    bestExercises: ["Romanian deadlift", "Nordic hamstring curl", "Leg curl", "Good morning"],
    trainingNote: "Train both jobs: one hip-hinge movement and one knee-flexion movement every week.",
  },
  {
    id: "calves-back",
    name: "Calves",
    latin: "Gastrocnemius · Soleus",
    side: "back",
    shapes: [
      { d: "M98 404 C90 416 90 442 98 458 C106 468 114 464 114 452 C114 432 108 414 98 404 Z" },
      { d: "M142 404 C150 416 150 442 142 458 C134 468 126 464 126 452 C126 432 132 414 142 404 Z" },
    ],
    function: "Drives push-off at the ankle; the soleus works with a bent knee, the gastrocnemius with a straight one.",
    bestExercises: ["Standing calf raise", "Seated calf raise", "Jump rope", "Loaded carries on toes"],
    trainingNote: "Pause three seconds in the stretched position — that is where calves grow.",
  },
];

export type OrganSystem = {
  id: string;
  name: string;
  role: string;
  training: string;
  markers: string[];
};

export const organSystems: OrganSystem[] = [
  {
    id: "heart",
    name: "Heart & circulation",
    role: "Pumps oxygen and nutrients to working muscle and clears metabolic waste.",
    training: "Zone 2 cardio 2–3 × 30 min a week lowers resting heart rate and speeds recovery between sets.",
    markers: ["Resting HR 50–65", "VO₂max climbing", "Blood pressure < 120/80"],
  },
  {
    id: "lungs",
    name: "Lungs & respiration",
    role: "Exchange oxygen and CO₂; ventilation is the limiter in high-rep and conditioning work.",
    training: "Nasal breathing on easy cardio, braced diaphragmatic breathing under the bar.",
    markers: ["Breath recovery < 2 min after a hard set"],
  },
  {
    id: "liver-kidneys",
    name: "Liver & kidneys",
    role: "Process protein by-products, store glycogen, and regulate hydration and electrolytes.",
    training: "High protein is safe with healthy kidneys — hydration is the real variable: 30–40 ml per kg per day.",
    markers: ["Pale urine", "Stable morning weight"],
  },
  {
    id: "digestive",
    name: "Digestive system",
    role: "Breaks food into the amino acids, glucose and fats that build tissue.",
    training: "Bulking? Spread protein across 4 meals. Cutting? Prioritise fibre and volume to stay full.",
    markers: ["25–35 g fibre daily", "No bloating in training"],
  },
  {
    id: "nervous",
    name: "Nervous system",
    role: "Recruits motor units — early strength gains are neural, not muscular.",
    training: "Heavy low-rep work trains the nervous system; it fatigues slower than muscle but recovers slower too.",
    markers: ["Grip strength stable", "Motivation and sleep quality"],
  },
  {
    id: "endocrine",
    name: "Hormones & endocrine",
    role: "Testosterone, growth hormone, cortisol and insulin steer growth and fat loss.",
    training: "Sleep 7–9 h, keep body fat in a healthy range, avoid chronic crash deficits.",
    markers: ["Morning energy", "Libido", "Consistent strength progress"],
  },
  {
    id: "skeleton",
    name: "Bones & joints",
    role: "Bone adapts to load; tendons and ligaments adapt slower than muscle.",
    training: "Progress load by ~5% a week maximum — most injuries come from tendons lagging behind strength.",
    markers: ["No joint pain 24 h after training"],
  },
];
