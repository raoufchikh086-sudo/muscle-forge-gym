export type TechniqueCategory = "gym" | "home_equipment" | "calisthenics";
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "arms"
  | "legs"
  | "glutes"
  | "core"
  | "full_body";
export type Level = "beginner" | "intermediate" | "advanced";

export type TechniqueVideo = {
  slug: string;
  name: string;
  category: TechniqueCategory;
  muscleGroup: MuscleGroup;
  level: Level;
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

export const muscleGroups: { value: MuscleGroup | "all"; label: string }[] = [
  { value: "all", label: "All muscles" },
  { value: "chest", label: "Chest" },
  { value: "back", label: "Back" },
  { value: "shoulders", label: "Shoulders" },
  { value: "arms", label: "Arms" },
  { value: "legs", label: "Legs" },
  { value: "glutes", label: "Glutes" },
  { value: "core", label: "Core" },
  { value: "full_body", label: "Full body" },
];

export const levels: { value: Level | "all"; label: string }[] = [
  { value: "all", label: "Any level" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export const techniqueVideos: TechniqueVideo[] = [
  {
    slug: "barbell-back-squat",
    name: "Barbell back squat",
    category: "gym",
    muscleGroup: "legs",
    level: "intermediate",
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
    muscleGroup: "back",
    level: "intermediate",
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
    muscleGroup: "chest",
    level: "intermediate",
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
    muscleGroup: "shoulders",
    level: "intermediate",
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
    muscleGroup: "back",
    level: "intermediate",
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
    muscleGroup: "back",
    level: "beginner",
    muscles: "Lats · Biceps",
    query: "lat pulldown proper form tutorial",
    cues: [
      "Slight lean back, chest up.",
      "Drive elbows down and back to the pockets.",
      "Full stretch at the top without shrugging.",
    ],
  },
  {
    slug: "leg-press",
    name: "Leg press",
    category: "gym",
    muscleGroup: "legs",
    level: "beginner",
    muscles: "Quads · Glutes",
    query: "leg press machine proper form tutorial",
    cues: [
      "Feet shoulder-width, mid-platform.",
      "Lower until the hips start to tuck, no further.",
      "Never lock the knees out hard at the top.",
    ],
  },
  {
    slug: "cable-triceps-pushdown",
    name: "Cable triceps pushdown",
    category: "gym",
    muscleGroup: "arms",
    level: "beginner",
    muscles: "Triceps",
    query: "cable triceps pushdown proper form",
    cues: [
      "Elbows pinned to the ribs.",
      "Only the forearms move.",
      "Squeeze one second at full extension.",
    ],
  },
  {
    slug: "hip-thrust",
    name: "Barbell hip thrust",
    category: "gym",
    muscleGroup: "glutes",
    level: "beginner",
    muscles: "Glutes · Hamstrings",
    query: "barbell hip thrust proper form tutorial",
    cues: [
      "Bench under the shoulder blades.",
      "Chin tucked, ribs down.",
      "Lock out with a hard glute squeeze, not a back arch.",
    ],
  },
  {
    slug: "dumbbell-goblet-squat",
    name: "Goblet squat",
    category: "home_equipment",
    muscleGroup: "legs",
    level: "beginner",
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
    muscleGroup: "legs",
    level: "beginner",
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
    muscleGroup: "chest",
    level: "beginner",
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
    muscleGroup: "back",
    level: "beginner",
    muscles: "Lats · Mid back",
    query: "single arm dumbbell row proper form",
    cues: [
      "Flat back, hips square to the bench.",
      "Row to the hip, not the shoulder.",
      "Pause and squeeze at the top.",
    ],
  },
  {
    slug: "band-face-pull",
    name: "Resistance band face pull",
    category: "home_equipment",
    muscleGroup: "shoulders",
    level: "beginner",
    muscles: "Rear delts · Upper back",
    query: "resistance band face pull proper form",
    cues: [
      "Anchor the band at eye height.",
      "Pull to the forehead, elbows high.",
      "External rotation at the end — hands past the ears.",
    ],
  },
  {
    slug: "dumbbell-curl",
    name: "Dumbbell biceps curl",
    category: "home_equipment",
    muscleGroup: "arms",
    level: "beginner",
    muscles: "Biceps",
    query: "dumbbell biceps curl proper form tutorial",
    cues: [
      "Elbows stay by the ribs.",
      "No swinging from the hips.",
      "Lower for three seconds every rep.",
    ],
  },
  {
    slug: "bulgarian-split-squat",
    name: "Bulgarian split squat",
    category: "home_equipment",
    muscleGroup: "glutes",
    level: "intermediate",
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
    muscleGroup: "chest",
    level: "beginner",
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
    muscleGroup: "back",
    level: "intermediate",
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
    muscleGroup: "chest",
    level: "intermediate",
    muscles: "Chest · Triceps",
    query: "parallel bar dips proper form tutorial",
    cues: [
      "Lean forward for chest, upright for triceps.",
      "Depth until the upper arm is parallel.",
      "Shoulders down, never shrugged.",
    ],
  },
  {
    slug: "pike-push-up",
    name: "Pike push-up",
    category: "calisthenics",
    muscleGroup: "shoulders",
    level: "intermediate",
    muscles: "Shoulders · Triceps",
    query: "pike push up proper form tutorial",
    cues: [
      "Hips high, body in an inverted V.",
      "Crown of the head to the floor between the hands.",
      "Elbows track slightly forward, not flared.",
    ],
  },
  {
    slug: "muscle-up",
    name: "Bar muscle-up",
    category: "calisthenics",
    muscleGroup: "full_body",
    level: "advanced",
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
    muscleGroup: "legs",
    level: "advanced",
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
    muscleGroup: "back",
    level: "advanced",
    muscles: "Lats · Core",
    query: "front lever progression tutorial",
    cues: [
      "Tuck → advanced tuck → one leg → full.",
      "Straight arms, lats pulling the bar to the hips.",
      "Posterior pelvic tilt keeps the body flat.",
    ],
  },
  {
    slug: "handstand",
    name: "Freestanding handstand",
    category: "calisthenics",
    muscleGroup: "shoulders",
    level: "advanced",
    muscles: "Shoulders · Core · Balance",
    query: "freestanding handstand tutorial progression",
    cues: [
      "Wall chest-to-wall holds build the line.",
      "Fingertips control balance, not the shoulders.",
      "Ribs down, glutes on, toes pointed.",
    ],
  },
  {
    slug: "hanging-leg-raise",
    name: "Hanging leg raise",
    category: "calisthenics",
    muscleGroup: "core",
    level: "intermediate",
    muscles: "Abs · Hip flexors",
    query: "hanging leg raise proper form tutorial",
    cues: [
      "No swinging — control the descent.",
      "Curl the pelvis up at the top.",
      "Knees bent first, straight legs later.",
    ],
  },
  {
    slug: "hollow-body-hold",
    name: "Hollow body hold",
    category: "calisthenics",
    muscleGroup: "core",
    level: "beginner",
    muscles: "Abs · Deep core",
    query: "hollow body hold proper form tutorial",
    cues: [
      "Lower back glued to the floor.",
      "Shorten the lever (knees bent) if the back arches.",
      "Breathe — don't hold your breath.",
    ],
  },
  {
    slug: "nordic-curl",
    name: "Nordic hamstring curl",
    category: "calisthenics",
    muscleGroup: "legs",
    level: "advanced",
    muscles: "Hamstrings",
    query: "nordic hamstring curl progression tutorial",
    cues: [
      "Anchor the ankles securely.",
      "Hips locked in line with the shoulders.",
      "Fight the fall as long as possible, push back up.",
    ],
  },
  {
    slug: "glute-bridge",
    name: "Bodyweight glute bridge",
    category: "calisthenics",
    muscleGroup: "glutes",
    level: "beginner",
    muscles: "Glutes · Hamstrings",
    query: "glute bridge proper form tutorial",
    cues: [
      "Heels close to the glutes.",
      "Drive through the heels, not the toes.",
      "Pause two seconds at the top.",
    ],
  },
  {
    slug: "chair-dip",
    name: "Chair triceps dip",
    category: "home_equipment",
    muscleGroup: "arms",
    level: "beginner",
    muscles: "Triceps · Front delts",
    query: "chair triceps dips proper form",
    cues: [
      "Hands at the edge, fingers forward.",
      "Elbows straight back, not flared.",
      "Stop when the upper arm is parallel.",
    ],
  },
  {
    slug: "burpee",
    name: "Burpee",
    category: "calisthenics",
    muscleGroup: "full_body",
    level: "beginner",
    muscles: "Full body · Conditioning",
    query: "burpee proper form tutorial",
    cues: [
      "Chest to floor, full push-up at the bottom.",
      "Jump the feet outside the hands.",
      "Extend fully at the top — hips, knees, arms.",
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
