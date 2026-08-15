export type Alternative = {
  slug: string;
  equipment: string;
  household: string;
  how: string;
  loads: string;
  trains: string;
  warning?: string;
};

export const homeAlternatives: Alternative[] = [
  {
    slug: "dumbbells",
    equipment: "Dumbbells",
    household: "Backpack filled with books, water bottles, milk jugs",
    how: "Load a sturdy backpack with books and grip the shoulder straps for curls, presses and rows. A 5 L water jug weighs 5 kg — two jugs are a solid dumbbell pair.",
    loads: "Books ≈ 0.5–1 kg each · 1.5 L bottle = 1.5 kg · 5 L jug = 5 kg",
    trains: "Curls · Presses · Rows · Goblet squats",
  },
  {
    slug: "barbell",
    equipment: "Barbell",
    household: "Broomstick through two grocery bags or paint tins",
    how: "Thread a strong broom handle or steel pipe through the handles of two evenly loaded bags. Use it for front squats, overhead press and RDLs at light load.",
    loads: "Rice/flour sacks 5–10 kg per side",
    trains: "Front squat · Overhead press · RDL",
    warning: "Test the handle by bouncing it across two chairs before you load it on your back.",
  },
  {
    slug: "bench",
    equipment: "Bench",
    household: "Sturdy chair, low table, sofa edge or a firm bed frame",
    how: "Use a hard chair for step-ups, split squats and triceps dips. A low coffee table works for chest-supported rows and elevated push-ups.",
    loads: "Bodyweight",
    trains: "Dips · Step-ups · Bulgarian split squats · Incline push-ups",
  },
  {
    slug: "pullup-bar",
    equipment: "Pull-up bar",
    household: "Door frame bar, park scaffolding, a solid tree branch, or a towel over a door",
    how: "No bar? Loop a thick towel over the top of a closed, locked door and do isometric rows. A staircase banister works for Australian rows underneath it.",
    loads: "Bodyweight",
    trains: "Rows · Pull-up isometrics · Scapular pulls",
    warning: "Test any anchor with a slow hang before you commit full bodyweight.",
  },
  {
    slug: "resistance-bands",
    equipment: "Resistance bands",
    household: "Old bicycle inner tube, tights, or a long towel for isometrics",
    how: "A bicycle inner tube gives real elastic tension for face pulls, presses and lateral raises. Anchor it around a door hinge or your own feet.",
    loads: "Light–medium band equivalent",
    trains: "Face pulls · Presses · Lateral raises · Pull-aparts",
  },
  {
    slug: "cable-machine",
    equipment: "Cable machine",
    household: "Band or tube anchored in a closed door, plus a towel handle",
    how: "Anchor the band at three heights — top hinge for pushdowns, middle for rows and Pallof presses, bottom for curls and lateral raises.",
    loads: "Band tension",
    trains: "Pushdowns · Rows · Pallof press · Curls",
  },
  {
    slug: "sled",
    equipment: "Sled / prowler",
    household: "Loaded laundry basket or towel on a smooth floor",
    how: "Put a heavy basket or a folded towel loaded with books on a hard floor and push it end to end for 20 m sprints.",
    loads: "10–30 kg",
    trains: "Conditioning · Quads · Calves",
  },
  {
    slug: "ab-wheel",
    equipment: "Ab wheel",
    household: "Two socks or a towel on a smooth floor, or a mop bucket with wheels",
    how: "Kneel with your hands on folded towels and slide forward keeping the ribs down; slide back with the lats.",
    loads: "Bodyweight",
    trains: "Core · Lats",
    warning: "Only go as far as you can keep the lower back from arching.",
  },
  {
    slug: "leg-curl",
    equipment: "Leg curl machine",
    household: "Sliders (socks) on a smooth floor, or a partner holding your ankles",
    how: "Lie on your back, heels on towels, bridge up and slide the heels out and back in. For Nordics, wedge your heels under a sofa.",
    loads: "Bodyweight",
    trains: "Hamstrings · Glutes",
  },
  {
    slug: "weight-vest",
    equipment: "Weight vest",
    household: "Backpack with books or bottles worn on the chest",
    how: "Wear the loaded backpack in front for dips and push-ups, on the back for pull-ups, squats and lunges.",
    loads: "5–20 kg",
    trains: "Every bodyweight movement",
  },
  {
    slug: "kettlebell",
    equipment: "Kettlebell",
    household: "Milk jug with a handle, or a bag of rice inside a strong tote",
    how: "A 5 L jug with the handle intact swings safely. Use it for swings, goblet squats and carries.",
    loads: "5–10 kg",
    trains: "Swings · Goblet squats · Carries",
  },
  {
    slug: "parallettes",
    equipment: "Parallettes",
    household: "Two sturdy chairs back to back, or thick books",
    how: "Chairs let you get deep dips, L-sits and elevated push-ups with a full range of motion.",
    loads: "Bodyweight",
    trains: "Dips · L-sit · Deep push-ups",
    warning: "Use chairs with a wide, non-sliding base on carpet or a rubber mat.",
  },
];
