export type SkillStep = {
  name: string;
  target: string;
  detail: string;
};

export type SkillPath = {
  slug: string;
  name: string;
  tagline: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Elite";
  timeframe: string;
  prerequisites: string[];
  steps: SkillStep[];
  videoQuery: string;
};

export const skillPaths: SkillPath[] = [
  {
    slug: "pull-up",
    name: "First pull-up",
    tagline: "The gateway skill — everything upper body starts here.",
    difficulty: "Beginner",
    timeframe: "4–10 weeks",
    prerequisites: ["Dead hang 20 s", "10 push-ups"],
    videoQuery: "how to get your first pull up progression",
    steps: [
      { name: "Dead hang", target: "3 × 30 s", detail: "Build grip and shoulder tolerance. Shoulders active, not shrugged." },
      { name: "Scapular pull", target: "3 × 8", detail: "Straight arms, pull the shoulder blades down only." },
      { name: "Australian row", target: "3 × 12", detail: "Bar at hip height, body straight, chest to bar." },
      { name: "Band-assisted pull-up", target: "4 × 5", detail: "Reduce band thickness every two weeks." },
      { name: "Negative pull-up", target: "5 × 1 (5 s down)", detail: "Jump to the top, lower as slowly as possible." },
      { name: "Full pull-up", target: "1 → 5 reps", detail: "Dead hang start, chin clearly over the bar." },
    ],
  },
  {
    slug: "muscle-up",
    name: "Bar muscle-up",
    tagline: "Pull, turnover, press — the classic calisthenics milestone.",
    difficulty: "Advanced",
    timeframe: "4–9 months",
    prerequisites: ["8 strict pull-ups", "10 straight bar dips"],
    videoQuery: "bar muscle up progression tutorial",
    steps: [
      { name: "Explosive pull-up", target: "5 × 3", detail: "Pull the bar to the lower chest every rep." },
      { name: "Straight bar dip", target: "3 × 8", detail: "Learn to press out above the bar." },
      { name: "Chest-to-bar with false grip", target: "4 × 4", detail: "Wrist over the bar from the start." },
      { name: "Kip-free transition drill", target: "3 × 3", detail: "Band-assisted turnover, elbows fast and high." },
      { name: "Jumping muscle-up", target: "4 × 3", detail: "Low bar, minimal leg drive, own the turnover." },
      { name: "Strict muscle-up", target: "1 → 3 reps", detail: "No swing, no kip, straight-arm press to lockout." },
    ],
  },
  {
    slug: "handstand",
    name: "Freestanding handstand",
    tagline: "Balance, shoulders and patience.",
    difficulty: "Advanced",
    timeframe: "6–12 months",
    prerequisites: ["Overhead mobility", "Wall plank 60 s"],
    videoQuery: "freestanding handstand progression tutorial",
    steps: [
      { name: "Wrist prep", target: "Daily 3 min", detail: "Non-negotiable — wrists carry everything." },
      { name: "Wall plank (feet on wall)", target: "3 × 45 s", detail: "Hollow line, hips over shoulders." },
      { name: "Chest-to-wall hold", target: "5 × 40 s", detail: "Walk hands as close to the wall as possible." },
      { name: "Heel pulls", target: "5 × 5", detail: "Peel one heel off the wall, then both, find the balance point." },
      { name: "Wall kick-out", target: "10 attempts", detail: "Kick up away from the wall and catch balance with the fingers." },
      { name: "Freestanding hold", target: "10 → 30 s", detail: "Fingertips make micro-corrections, ribs stay down." },
    ],
  },
  {
    slug: "front-lever",
    name: "Front lever",
    tagline: "Pure straight-arm lat and core strength.",
    difficulty: "Elite",
    timeframe: "6–18 months",
    prerequisites: ["10 pull-ups", "Solid hollow body 45 s"],
    videoQuery: "front lever progression tutorial",
    steps: [
      { name: "Hollow body hold", target: "3 × 45 s", detail: "The lever is a hanging hollow body." },
      { name: "Tuck front lever", target: "5 × 15 s", detail: "Straight arms, back parallel to the floor." },
      { name: "Advanced tuck", target: "5 × 12 s", detail: "Open the hips to 90°, keep the pelvis tilted." },
      { name: "One-leg lever", target: "5 × 10 s each", detail: "Extend one leg, hips level." },
      { name: "Straddle lever", target: "5 × 8 s", detail: "Wide legs shorten the lever — a huge bridge step." },
      { name: "Full front lever", target: "5 → 10 s", detail: "Body flat, straight arms, no sag in the hips." },
    ],
  },
  {
    slug: "pistol-squat",
    name: "Pistol squat",
    tagline: "Single-leg strength, mobility and balance in one.",
    difficulty: "Intermediate",
    timeframe: "8–16 weeks",
    prerequisites: ["20 bodyweight squats", "Ankle mobility"],
    videoQuery: "pistol squat progression tutorial",
    steps: [
      { name: "Deep squat hold", target: "3 × 60 s", detail: "Ankles and hips must open first." },
      { name: "Split squat", target: "3 × 12 each", detail: "Build unilateral strength." },
      { name: "Box pistol", target: "4 × 8 each", detail: "Sit to a high box, then lower the box over weeks." },
      { name: "Assisted pistol", target: "4 × 6 each", detail: "Hold a door frame or a band overhead." },
      { name: "Eccentric pistol", target: "4 × 4 each", detail: "5 s down, stand on two legs." },
      { name: "Full pistol", target: "3 × 5 each", detail: "Heel flat, chest up, control the bottom." },
    ],
  },
  {
    slug: "human-flag",
    name: "Human flag",
    tagline: "Obliques, lats and shoulders against gravity.",
    difficulty: "Elite",
    timeframe: "9–24 months",
    prerequisites: ["Strong side plank", "Overhead pressing strength"],
    videoQuery: "human flag progression tutorial",
    steps: [
      { name: "Vertical flag hold", target: "5 × 10 s", detail: "Body vertical, learn the push/pull arm split." },
      { name: "Tuck flag", target: "5 × 8 s", detail: "Knees to chest, hips stacked over the bottom hand." },
      { name: "Half-lay flag", target: "5 × 6 s", detail: "One leg extended." },
      { name: "Straddle flag", target: "5 × 5 s", detail: "Both legs out, wide." },
      { name: "Full flag", target: "3 → 8 s", detail: "Body horizontal, top arm pulling, bottom arm pressing." },
    ],
  },
];
