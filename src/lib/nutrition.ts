export type Sex = "male" | "female";
export type ActivityKey = "sedentary" | "light" | "moderate" | "high" | "athlete";
export type GoalKey = "bulk" | "maintain" | "cut";

export const activityLevels: { value: ActivityKey; label: string; factor: number }[] = [
  { value: "sedentary", label: "Desk job, no training", factor: 1.2 },
  { value: "light", label: "Training 1–3 days", factor: 1.375 },
  { value: "moderate", label: "Training 3–5 days", factor: 1.55 },
  { value: "high", label: "Training 6–7 days", factor: 1.725 },
  { value: "athlete", label: "Physical job + daily training", factor: 1.9 },
];

export const nutritionGoals: { value: GoalKey; label: string; delta: number }[] = [
  { value: "bulk", label: "Muscle gain", delta: 0.12 },
  { value: "maintain", label: "Maintain", delta: 0 },
  { value: "cut", label: "Cutting", delta: -0.18 },
];

/** Mifflin–St Jeor */
export function bmr(sex: Sex, kg: number, cm: number, age: number): number {
  const base = 10 * kg + 6.25 * cm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export function tdee(sex: Sex, kg: number, cm: number, age: number, activity: ActivityKey): number {
  const factor = activityLevels.find((a) => a.value === activity)?.factor ?? 1.55;
  return bmr(sex, kg, cm, age) * factor;
}

/** US Navy method, measurements in cm */
export function bodyFatNavy(
  sex: Sex,
  cm: number,
  waist: number,
  neck: number,
  hip?: number,
): number | null {
  if (!cm || !waist || !neck) return null;
  if (sex === "male") {
    if (waist - neck <= 0) return null;
    return 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(cm)) - 450;
  }
  if (!hip || waist + hip - neck <= 0) return null;
  return (
    495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(cm)) - 450
  );
}

export type MacroPlan = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

export function macros(calories: number, kg: number, goal: GoalKey): MacroPlan {
  const proteinPerKg = goal === "cut" ? 2.2 : goal === "bulk" ? 1.9 : 1.8;
  const protein = Math.round(kg * proteinPerKg);
  const fat = Math.round((calories * (goal === "cut" ? 0.25 : 0.27)) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories: Math.round(calories), protein, fat, carbs };
}

export type Recipe = {
  slug: string;
  name: string;
  goal: "bulk" | "cut" | "both";
  costPerServing: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  steps: string;
};

export const recipes: Recipe[] = [
  {
    slug: "eggs-oats-power-bowl",
    name: "Egg & oat power bowl",
    goal: "bulk",
    costPerServing: "≈ $1.10",
    kcal: 720,
    protein: 42,
    carbs: 78,
    fat: 26,
    ingredients: [
      "90 g rolled oats",
      "3 whole eggs + 2 whites",
      "1 banana",
      "1 tbsp peanut butter",
      "250 ml milk",
    ],
    steps:
      "Cook oats in the milk, scramble the eggs in a dry non-stick pan, combine in one bowl, top with sliced banana and peanut butter.",
  },
  {
    slug: "chicken-rice-tray",
    name: "Chicken & rice batch tray",
    goal: "both",
    costPerServing: "≈ $1.40",
    kcal: 610,
    protein: 52,
    carbs: 68,
    fat: 14,
    ingredients: [
      "800 g chicken thigh or breast",
      "500 g dry rice",
      "2 onions, 3 peppers",
      "Paprika, cumin, garlic, salt",
      "1 tbsp olive oil per portion",
    ],
    steps:
      "Season and roast the chicken with the vegetables at 200°C for 30 min. Cook the rice. Split into 5 containers — five days of lunches in one hour.",
  },
  {
    slug: "lentil-tuna-bowl",
    name: "Lentil & tuna cutting bowl",
    goal: "cut",
    costPerServing: "≈ $0.90",
    kcal: 430,
    protein: 41,
    carbs: 42,
    fat: 9,
    ingredients: [
      "120 g cooked lentils",
      "1 tin tuna in water",
      "Tomato, cucumber, red onion",
      "Lemon juice, olive oil spray",
      "Parsley",
    ],
    steps:
      "Drain the tuna, mix everything cold, dress with lemon and a spray of oil. High volume, high protein, almost no cost.",
  },
  {
    slug: "cottage-cheese-pancakes",
    name: "Cottage cheese protein pancakes",
    goal: "both",
    costPerServing: "≈ $1.00",
    kcal: 480,
    protein: 38,
    carbs: 52,
    fat: 12,
    ingredients: ["200 g cottage cheese", "2 eggs", "60 g oat flour", "Cinnamon", "Berries"],
    steps: "Blend everything, cook small pancakes on medium heat, top with berries.",
  },
  {
    slug: "beef-mince-potato",
    name: "Beef mince & potato mass plate",
    goal: "bulk",
    costPerServing: "≈ $1.80",
    kcal: 820,
    protein: 55,
    carbs: 82,
    fat: 30,
    ingredients: [
      "200 g 5% beef mince",
      "400 g potatoes",
      "Onion, garlic, tomato paste",
      "Green beans",
    ],
    steps:
      "Brown the mince with onion, garlic and tomato paste. Boil or air-fry the potatoes. Serve with steamed beans.",
  },
  {
    slug: "chickpea-shakshuka",
    name: "Chickpea shakshuka",
    goal: "cut",
    costPerServing: "≈ $0.80",
    kcal: 450,
    protein: 27,
    carbs: 48,
    fat: 16,
    ingredients: ["1 tin chickpeas", "1 tin tomatoes", "3 eggs", "Onion, pepper, cumin, paprika"],
    steps:
      "Fry onion and pepper, add tomatoes and chickpeas, simmer 10 min, crack the eggs in, cover until set.",
  },
  {
    slug: "greek-yogurt-mass-shake",
    name: "3-ingredient mass shake",
    goal: "bulk",
    costPerServing: "≈ $1.20",
    kcal: 690,
    protein: 45,
    carbs: 76,
    fat: 22,
    ingredients: ["300 g Greek yogurt", "80 g oats", "1 banana", "2 dates", "300 ml milk"],
    steps: "Blend 40 seconds. Drink after training or between meals when appetite is low.",
  },
  {
    slug: "tuna-egg-salad-wraps",
    name: "Tuna & egg wraps",
    goal: "cut",
    costPerServing: "≈ $1.10",
    kcal: 400,
    protein: 36,
    carbs: 34,
    fat: 12,
    ingredients: ["1 tin tuna", "2 boiled eggs", "2 wholemeal wraps", "Greek yogurt", "Lettuce"],
    steps: "Mash tuna and eggs with yogurt instead of mayo, roll in the wraps with lettuce.",
  },
];
