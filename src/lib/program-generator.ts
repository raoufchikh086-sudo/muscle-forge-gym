import type { Level } from "./technique-videos";

export type EquipmentKey = "none" | "bands" | "pullup_bar" | "dumbbells" | "full_gym";
export type TrainingGoal = "bulk" | "cut" | "fitness";

export const equipmentOptions: { value: EquipmentKey; label: string; hint: string }[] = [
  { value: "none", label: "No equipment", hint: "Floor, wall, chair" },
  { value: "bands", label: "Resistance bands", hint: "Loop or tube bands" },
  { value: "pullup_bar", label: "Pull-up bar", hint: "Doorway or park bar" },
  { value: "dumbbells", label: "Dumbbells", hint: "Adjustable or fixed" },
  { value: "full_gym", label: "Full gym", hint: "Barbells and machines" },
];

export const trainingGoals: { value: TrainingGoal; label: string; blurb: string }[] = [
  { value: "bulk", label: "Bulking", blurb: "Add muscle — heavier loads, more volume, calorie surplus" },
  { value: "cut", label: "Cutting", blurb: "Keep muscle, drop fat — density work and short rests" },
  { value: "fitness", label: "General fitness", blurb: "Strength, conditioning and mobility balance" },
];

export type GeneratedExercise = { name: string; sets: string; reps: string; rest: string };
export type GeneratedDay = { day: string; focus: string; exercises: GeneratedExercise[] };
export type GeneratedPlan = {
  title: string;
  summary: string;
  daysPerWeek: number;
  days: GeneratedDay[];
  notes: string[];
};

type Pool = Record<string, Partial<Record<EquipmentKey, string[]>>>;

const pool: Pool = {
  push: {
    none: ["Push-up", "Pike push-up", "Chair triceps dip", "Decline push-up"],
    bands: ["Band chest press", "Band overhead press", "Band triceps pushdown", "Push-up"],
    pullup_bar: ["Push-up", "Pike push-up", "Bar dip", "Chair triceps dip"],
    dumbbells: ["Dumbbell bench press", "Dumbbell shoulder press", "Dumbbell lateral raise", "Overhead triceps extension"],
    full_gym: ["Barbell bench press", "Standing overhead press", "Incline dumbbell press", "Cable triceps pushdown"],
  },
  pull: {
    none: ["Towel row on a door", "Backpack bent-over row", "Prone Y-T-W raise", "Reverse snow angel"],
    bands: ["Band lat pulldown", "Band row", "Band face pull", "Band biceps curl"],
    pullup_bar: ["Pull-up", "Chin-up", "Australian row", "Hanging scapular pull"],
    dumbbells: ["Single-arm dumbbell row", "Dumbbell pullover", "Dumbbell rear delt fly", "Dumbbell biceps curl"],
    full_gym: ["Conventional deadlift", "Barbell bent-over row", "Lat pulldown", "Cable face pull"],
  },
  legs: {
    none: ["Bodyweight squat", "Bulgarian split squat", "Glute bridge", "Calf raise"],
    bands: ["Band squat", "Band Romanian deadlift", "Band lateral walk", "Glute bridge"],
    pullup_bar: ["Bodyweight squat", "Bulgarian split squat", "Nordic hamstring curl", "Calf raise"],
    dumbbells: ["Goblet squat", "Dumbbell Romanian deadlift", "Walking lunge", "Dumbbell calf raise"],
    full_gym: ["Barbell back squat", "Romanian deadlift", "Leg press", "Seated calf raise"],
  },
  core: {
    none: ["Hollow body hold", "Plank", "Leg raise", "Side plank"],
    bands: ["Band Pallof press", "Hollow body hold", "Band dead bug", "Side plank"],
    pullup_bar: ["Hanging leg raise", "Hollow body hold", "Toes-to-bar", "Plank"],
    dumbbells: ["Dumbbell suitcase carry", "Weighted crunch", "Plank", "Side plank"],
    full_gym: ["Cable crunch", "Hanging leg raise", "Ab wheel rollout", "Plank"],
  },
  conditioning: {
    none: ["Burpee", "Mountain climber", "High knees", "Jump squat"],
    bands: ["Burpee", "Band thruster", "Mountain climber", "Jump squat"],
    pullup_bar: ["Burpee pull-up", "Burpee", "Mountain climber", "Jump squat"],
    dumbbells: ["Dumbbell thruster", "Dumbbell snatch", "Burpee", "Farmer carry"],
    full_gym: ["Rowing intervals", "Sled push", "Kettlebell swing", "Assault bike sprints"],
  },
};

function pick(group: keyof typeof pool, equipment: EquipmentKey, count: number): string[] {
  const list = pool[group]?.[equipment] ?? pool[group]?.none ?? [];
  return list.slice(0, count);
}

function schemeFor(goal: TrainingGoal, level: Level) {
  if (goal === "bulk")
    return {
      sets: level === "beginner" ? "3" : level === "intermediate" ? "4" : "4–5",
      reps: "6–12",
      rest: "90–150 s",
    };
  if (goal === "cut")
    return {
      sets: level === "beginner" ? "3" : "4",
      reps: "12–20",
      rest: "45–60 s",
    };
  return { sets: "3", reps: "8–15", rest: "60–90 s" };
}

const splits: Record<number, { day: string; focus: string; groups: (keyof typeof pool)[] }[]> = {
  3: [
    { day: "Day 1", focus: "Full body — push emphasis", groups: ["push", "legs", "core"] },
    { day: "Day 2", focus: "Full body — pull emphasis", groups: ["pull", "legs", "core"] },
    { day: "Day 3", focus: "Full body + conditioning", groups: ["push", "pull", "conditioning"] },
  ],
  4: [
    { day: "Day 1", focus: "Upper — push", groups: ["push", "core"] },
    { day: "Day 2", focus: "Lower", groups: ["legs", "core"] },
    { day: "Day 3", focus: "Upper — pull", groups: ["pull", "core"] },
    { day: "Day 4", focus: "Lower + conditioning", groups: ["legs", "conditioning"] },
  ],
  5: [
    { day: "Day 1", focus: "Push", groups: ["push", "core"] },
    { day: "Day 2", focus: "Pull", groups: ["pull", "core"] },
    { day: "Day 3", focus: "Legs", groups: ["legs", "core"] },
    { day: "Day 4", focus: "Upper mix", groups: ["push", "pull"] },
    { day: "Day 5", focus: "Legs + conditioning", groups: ["legs", "conditioning"] },
  ],
  6: [
    { day: "Day 1", focus: "Push", groups: ["push", "core"] },
    { day: "Day 2", focus: "Pull", groups: ["pull", "core"] },
    { day: "Day 3", focus: "Legs", groups: ["legs", "core"] },
    { day: "Day 4", focus: "Push", groups: ["push", "conditioning"] },
    { day: "Day 5", focus: "Pull", groups: ["pull", "core"] },
    { day: "Day 6", focus: "Legs + conditioning", groups: ["legs", "conditioning"] },
  ],
};

export function generatePlan(input: {
  level: Level;
  equipment: EquipmentKey;
  goal: TrainingGoal;
  daysPerWeek: number;
}): GeneratedPlan {
  const { level, equipment, goal } = input;
  const daysPerWeek = Math.min(6, Math.max(3, input.daysPerWeek));
  const scheme = schemeFor(goal, level);
  const perGroup = level === "beginner" ? 2 : level === "intermediate" ? 3 : 3;

  const days: GeneratedDay[] = (splits[daysPerWeek] ?? splits[4]!).map((d) => ({
    day: d.day,
    focus: d.focus,
    exercises: d.groups.flatMap((g) =>
      pick(g, equipment, g === "conditioning" ? 2 : perGroup).map((name) => ({
        name,
        sets: g === "conditioning" ? "4" : scheme.sets,
        reps: g === "conditioning" ? "40 s work" : g === "core" ? "10–15" : scheme.reps,
        rest: g === "conditioning" ? "20 s" : scheme.rest,
      })),
    ),
  }));

  const goalLabel = trainingGoals.find((g) => g.value === goal)!.label;
  const equipLabel = equipmentOptions.find((e) => e.value === equipment)!.label;

  return {
    title: `${goalLabel} · ${equipLabel} · ${daysPerWeek} days`,
    summary: `A ${daysPerWeek}-day weekly schedule built for a ${level} lifter training with ${equipLabel.toLowerCase()}, aimed at ${goalLabel.toLowerCase()}.`,
    daysPerWeek,
    days,
    notes: [
      `Rest ${scheme.rest} between working sets — ${goal === "cut" ? "keep the pace high" : "recover properly and lift heavy"}.`,
      "Add one rep or a little load every week before you add exercises.",
      goal === "bulk"
        ? "Eat in a small surplus (about +12% over TDEE) and sleep 7–9 hours."
        : goal === "cut"
          ? "Hold a moderate deficit (about −18%) and keep protein at 2.2 g/kg."
          : "Eat around maintenance and add 10–20 min of easy cardio on rest days.",
      "Warm up 5–8 minutes and do two ramp-up sets on the first exercise of each day.",
    ],
  };
}
