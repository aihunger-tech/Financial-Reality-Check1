import { TierContent, FinancialGoal, FinancialData } from "@/types";

export const FINANCIAL_GOALS: { label: string; value: FinancialGoal }[] = [
  { label: "Retire Early (FIRE)", value: 'RETIRE_EARLY' },
  { label: "Buy a Dream Home", value: 'BUY_HOUSE' },
  { label: "Slay My Debt", value: 'DEBT_FREE' },
  { label: "Build an Empire", value: 'GENERATIONAL_WEALTH' },
  { label: "Just stop stressing", value: 'JUST_SURVIVE' },
];

export const TIER_DATA: Record<string, TierContent> = {
  SURVIVING: {
    title: "You’re Surviving (Barely)",
    primary: "You’re not building wealth — you’re managing stress.",
    alts: [
      "One unexpected expense and things get real, fast.",
      "This isn’t stability. It’s controlled chaos.",
    ],
    roasts: [
      "Your money disappears faster than your motivation on Monday.",
      "Budgeting isn’t optional for you anymore; it's a rescue mission.",
    ],
    motivation: "You don’t need more luck — you need a system.",
    color: "text-red-500",
    bg: "bg-red-500/10",
    shake: true,
  },
  STABLE: {
    title: "You’re Stable… But Stuck",
    primary: "You’ve avoided disaster, but you’re not moving forward.",
    alts: [
      "Comfortable enough to relax. Not strong enough to grow.",
      "You’re maintaining life — not upgrading it.",
    ],
    roasts: [
      "Your bank account is calm, but it's not impressive.",
      "You’re playing defense your whole life. When do you start attacking?",
    ],
    motivation: "You’re one smart move away from real progress.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    shake: false,
  },
  COMFORTABLE: {
    title: "You’re Comfortable",
    primary: "You’re doing better than most — but still far from freedom.",
    alts: [
      "You’ve built momentum. Now don’t waste it on lifestyle creep.",
      "This is where people either level up… or plateau forever.",
    ],
    roasts: [
      "You’ve got potential. You’re just not fully using it.",
      "You’re closer than you think — but your habits are holding you back.",
    ],
    motivation: "With consistency, you could break into the top tier.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    shake: false,
  },
  RICH: {
    title: "You’re Quietly Winning",
    primary: "You’ve built real financial strength — and it shows.",
    alts: [
      "You’re ahead of the game. Most people never get here.",
      "This is what actual control looks like.",
    ],
    roasts: [
      "Don’t get comfortable. Wealth disappears faster than it builds.",
      "You’re doing well — now make sure you don't become a cliché.",
    ],
    motivation: "You’re in a position most people dream about. Protect it.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    shake: false,
  },
};

// We define a specific type for the step to ensure 'id' is a valid key of FinancialData
interface FormStep {
  id: keyof FinancialData;
  label: string;
  type: "text" | "number" | "email" | "goal";
  optional: boolean;
}

export const FORM_STEPS: FormStep[] = [
  { id: "firstName", label: "First Name", type: "text", optional: true },
  { id: "lastName", label: "Last Name", type: "text", optional: true },
  { id: "email", label: "Email Address", type: "email", optional: false },
  { id: "country", label: "Your Country", type: "text", optional: false },
  { id: "age", label: "How old are you?", type: "number", optional: false },
  { id: "income", label: "Monthly Income", type: "number", optional: false },
  { id: "savings", label: "Monthly Savings", type: "number", optional: false },
  { id: "spending", label: "Monthly Spending", type: "number", optional: false },
  { id: "debt", label: "Total Debt", type: "number", optional: false },
  { id: "goal", label: "Your Main Financial Goal", type: "goal", optional: false },
];
