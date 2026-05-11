import { TierContent, FinancialGoal, FinancialData, FormStep, MultiStep } from "@/types";

export const FINANCIAL_GOALS: { label: string; value: FinancialGoal }[] = [
  { label: "Retire Early (FIRE)", value: 'RETIRE_EARLY' },
  { label: "Buy a Dream Home", value: 'BUY_HOUSE' },
  { label: "Slay My Debt", value: 'DEBT_FREE' },
  { label: "Build an Empire", value: 'GENERATIONAL_WEALTH' },
  { label: "Just stop stressing", value: 'JUST_SURVIVE' },
];

export const INVESTMENT_SURVEY_QUESTIONS = [
  { q: "What is your primary risk tolerance?", options: ["Safe & Steady", "Moderate Growth", "Aggressive/High Risk"] },
  { q: "What percentage of your income can you commit monthly?", options: ["0-10%", "10-25%", "25%+"] },
  { q: "What is your target timeline for financial freedom?", options: ["Under 5 years", "5-15 years", "15+ years"] },
  { q: "Which asset class interests you most?", options: ["Stocks/ETFs", "Crypto/Web3", "Real Estate", "Gold/Commodities"] },
  { q: "How much is your current liquid investment capital?", options: ["$0 - $1k", "$1k - $10k", "$10k - $100k", "$100k+"] },
];

export const TIER_DATA: Record<string, TierContent> = {
  SURVIVING: {
    title: "You’re Surviving (Barely)",
    primary: "You’re not building wealth — you’re managing stress.",
    alts: ["One unexpected expense and things get real, fast.", "This isn’t stability. It’s controlled chaos."],
    roasts: ["Your money disappears faster than your motivation on Monday.", "Budgeting isn’t optional for you anymore."],
    motivation: "You don’t need more luck — you need a system.",
    color: "text-red-500",
    bg: "bg-red-500/10",
    shake: true,
    offerTitle: "The Emergency Budget Blueprint",
  },
  STABLE: {
    title: "You’re Stable… But Stuck",
    primary: "You’ve avoided disaster, but you’re not moving forward.",
    alts: ["Comfortable enough to relax. Not strong enough to grow.", "You’re maintaining life — not upgrading it."],
    roasts: ["Your bank account is calm, but it's not impressive.", "You’re playing defense your whole life."],
    motivation: "You’re one smart move away from real progress.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    shake: false,
    offerTitle: "The Wealth Accelerator Course",
  },
  COMFORTABLE: {
    title: "You’re Comfortable",
    primary: "You’re doing better than most — but still far from freedom.",
    alts: ["You’ve built momentum. Now don’t waste it.", "This is where people plateau forever."],
    roasts: ["You’ve got potential. You’re just not fully using it.", "You’re closer than you think — but not close enough."],
    motivation: "With consistency, you could break into the top tier.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    shake: false,
    offerTitle: "Advanced Asset Allocation Strategy",
  },
  RICH: {
    title: "You’re Quietly Winning",
    primary: "You’ve built real financial strength — and it shows.",
    alts: ["You’re ahead of the game. Most people never get here.", "This is what actual control looks like."],
    roasts: ["Don’t get comfortable. Wealth disappears faster than it builds.", "You’re doing well — now make it last."],
    motivation: "You’re in a position most people dream about. Protect it.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    shake: false,
    offerTitle: "Private Wealth Management Consultation",
  },
};

export const FORM_STEPS: (FormStep | MultiStep)[] = [
  { id: "name", label: "Who are you?", type: "multi", fields: [
    { id: "firstName", label: "First Name", type: "text", optional: false },
    { id: "lastName", label: "Last Name", type: "text", optional: true },
  ]},
  { id: "email", label: "Email Address", type: "email", optional: false },
  { id: "country", label: "Your Country", type: "text", optional: false },
  { id: "age", label: "How old are you?", type: "number", optional: false },
  { id: "finances", label: "Your Financials", type: "multi", fields: [
    { id: "income", label: "Monthly Income", type: "number", optional: false },
    { id: "spending", label: "Monthly Spending", type: "number", optional: false },
    { id: "savings", label: "Total Savings", type: "number", optional: false },
    { id: "debt", label: "Total Debt", type: "number", optional: false },
  ]},
  { id: "goal", label: "Your Main Financial Goal", type: "goal", optional: false },
];
