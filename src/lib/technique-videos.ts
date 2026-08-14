export type TechniqueCategory = "gym" | "home_equipment" | "calisthenics";

export type TechniqueVideo = {
  slug: string;
  name: string;
  category: TechniqueCategory;
  muscles: string;
  /** YouTube search query used for the embedded demonstration */
  query: string;
  cues: string[];
};

export const techniqueCategories: { value: TechniqueCategory | "all"; label: string }[] = [
  { value: "all", label: "All movements" },
  { value: "gym", label: "Gym & barbell" },
  { value: "home_equipment", label: "Home with equipment" },
  { value: "calisthenics", label: "Calisthenics" },
];

export const techniqueVideos: TechniqueVideo[] = [
  {
    slug: "barbell-back-squat",
    name: "Barbell back squat",
    category: "gym",
    muscles: "Quads · Glutes · Core",
    query: "barbell back squat proper form tutorial",
    cues: [
      "Bar sits on the traps, not the neck.",
      "Brace hard, break at hips and knees together.",
      "Knees track over toes, depth below parallel if mobility allows.",
    ],
  },
  {
    slug: "conventional-deadlift",
    name: "Conventional deadlift",
    category: "gym",
    muscles: "Posterior chain",
    query: "conventional deadlift proper form tutorial",
    cues: [
      "Bar over mid-foot, shins almost touching.",
      "Flat back, lats squeezed, chest proud.",
      "Push the floor away — don't yank the bar.",
    ],
  },
  {
    slug: "bench-press",
    name: "Barbell bench press",
    category: "gym",
    muscles: "Chest · Triceps · Front delts",
    query: "barbell bench press proper form tutorial",
    cues: [
      "Shoulder blades pinned down and back.",
      "Bar path from lower chest to over the shoulders.",
      "Feet planted, legs driving into the floor.",
    ],
  },
  {
    slug: "overhead-press",
    name: "Standing overhead press",
    category: "gym",
    muscles: "Shoulders · Triceps",
    query: "standing overhead press barbell proper form",
    cues: [
      "Elbows slightly in front of the bar.",
      "Glutes and abs tight — no leaning back.",
      "Head moves through once the bar clears the forehead.",
    ],
  },
  {
    slug: "barbell-row",
    name: "Barbell bent-over row",
    category: "gym",
    muscles: "Back · Rear delts · Biceps",
    query: "barbell bent over row proper form tutorial",
    cues: [
      "Hinge to roughly 45°, spine neutral.",
      "Pull to the lower ribs, elbows tight.",
      "Control the eccentric — no bouncing.",
    ],
  },
  {
    slug: "lat-pulldown",
    name: "Lat pulldown",
    category: "gym",
    muscles: "Lats · Biceps",
    query: "lat pulldown proper form tutorial",
    cues: [
      "Slight lean back, chest up.",
      "Drive elbows down and back to the pockets.",
      "Full stretch at the top without shrugging.",
    ],
  },
  {
    slug: "dumbbell-goblet-squat",
    name: "Goblet squat",
    category: "home_equipment",
    muscles: "Quads · Glutes · Core",
    query: "dumbbell goblet squat proper form tutorial",
    cues: [
      "Hold the bell close to the chest.",
      "Elbows inside the knees at the bottom.",
      "Sit down between the hips, not back.",
    ],
  },
  {
    slug: "dumbbell-romanian-deadlift",
    name: "Dumbbell Romanian deadlift",
    category: "home_equipment",
    muscles: "Hamstrings · Glutes",
    query: "dumbbell romanian deadlift proper form",
    cues: [
      "Push hips back, soft knees.",
      "Dumbbells stay close to the legs.",
      "Stop when the hamstrings stop stretching.",
    ],
  },
  {
    slug: "dumbbell-bench-press",
    name: "Dumbbell bench press",
    category: "home_equipment",
    muscles: "Chest · Triceps",
    query: "dumbbell bench press proper form tutorial",
    cues: [
      "45° elbow angle, wrists stacked.",
      "Lower until you feel a deep chest stretch.",
      "Press up and slightly together.",
    ],
  },
  {
    slug: "dumbbell-row",
    name: "Single-arm dumbbell row",
    category: "home_equipment",
    muscles: "Lats · Mid back",
    query: "single arm dumbbell row proper form",
    cues: [
      "Flat back, hips square to the bench.",
      "Row to the hip, not the shoulder.",
      "Pause and squeeze at the top.",
    ],
  },
  {
    slug: "bulgarian-split-squat",
    name: "Bulgarian split squat",
    category: "home_equipment",
    muscles: "Quads · Glutes",
    query: "bulgarian split squat proper form tutorial",
    cues: [
      "Front foot far enough forward to keep the shin vertical.",
      "Torso slightly forward for more glute.",
      "Drive through the whole front foot.",
    ],
  },
  {
    slug: "push-up",
    name: "Push-up",
    category: "calisthenics",
    muscles: "Chest · Triceps · Core",
    query: "perfect push up form tutorial",
    cues: [
      "Body in one straight line, glutes tight.",
      "Hands under the mid-chest, elbows ~45°.",
      "Chest touches, full lockout at the top.",
    ],
  },
  {
    slug: "pull-up",
    name: "Pull-up",
    category: "calisthenics",
    muscles: "Lats · Biceps",
    query: "how to do a proper pull up tutorial",
    cues: [
      "Start from a dead hang with active shoulders.",
      "Pull the elbows to the ribs, chest to the bar.",
      "Lower under control for 2–3 seconds.",
    ],
  },
  {
    slug: "dip",
    name: "Parallel bar dip",
    category: "calisthenics",
    muscles: "Chest · Triceps",
    query: "parallel bar dips proper form tutorial",
    cues: [
      "Lean forward for chest, upright for triceps.",
      "Depth until the upper arm is parallel.",
      "Shoulders down, never shrugged.",
    ],
  },
  {
    slug: "muscle-up",
    name: "Bar muscle-up",
    category: "calisthenics",
    muscles: "Full upper body",
    query: "bar muscle up tutorial progression",
    cues: [
      "Explosive pull to the sternum first.",
      "Fast wrist turnover over the bar.",
      "Press out with straight arms to finish.",
    ],
  },
  {
    slug: "pistol-squat",
    name: "Pistol squat",
    category: "calisthenics",
    muscles: "Quads · Glutes · Balance",
    query: "pistol squat tutorial progression",
    cues: [
      "Build with box pistols first.",
      "Arms forward as a counterweight.",
      "Heel stays flat on the floor.",
    ],
  },
  {
    slug: "front-lever",
    name: "Front lever progression",
    category: "calisthenics",
    muscles: "Lats · Core",
    query: "front lever progression tutorial",
    cues: [
      "Tuck → advanced tuck → one leg → full.",
      "Straight arms, lats pulling the bar to the hips.",
      "Posterior pelvic tilt keeps the body flat.",
    ],
  },
  {
    slug: "hanging-leg-raise",
    name: "Hanging leg raise",
    category: "calisthenics",
    muscles: "Abs · Hip flexors",
    query: "hanging leg raise proper form tutorial",
    cues: [
      "No swinging — control the descent.",
      "Curl the pelvis up at the top.",
      "Knees bent first, straight legs later.",
    ],
  },
];

export function techniqueEmbedUrl(query: string): string {
  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query)}`;
}

export function techniqueSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function findTechnique(exerciseName: string): TechniqueVideo | undefined {
  const n = exerciseName.toLowerCase();
  return (
    techniqueVideos.find((v) => n.includes(v.name.toLowerCase())) ??
    techniqueVideos.find((v) => v.name.toLowerCase().split(" ").every((w) => n.includes(w))) ??
    techniqueVideos.find((v) => n.includes(v.slug.split("-").slice(-1)[0]!))
  );
}
