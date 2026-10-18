import type { Period } from "@/lib/float";

export type FloatPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  period: Period;
  bnplFirst?: boolean;
  committed?: boolean;
  tool?: "split" | "convert";
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
  related: string[]; // float slugs or absolute hub paths
};

export const FLOAT_PAGES: FloatPage[] = [
  {
    slug: "afterpay-budget-calculator",
    title: "Afterpay Budget Calculator: What Can I Spend?",
    description: "Add your pay, bills and Afterpay or other BNPL instalments to see what you can safely spend this week. Free, in AUD, no sign up needed.",
    h1: "Afterpay and BNPL budget calculator",
    intro: "Pay in 4 plans feel small one at a time. Add them next to your pay and bills, and you can see what is really left for this week.",
    period: "week",
    bnplFirst: true,
    sections: [
      { heading: "How instalments eat into your pay", body: "A pay in 4 plan usually splits a purchase into four payments a fortnight apart. Two or three plans running at once can take a real share of every pay. Float puts each instalment on its due date, so you see the weeks where they pile up." },
    ],
    faqs: [
      { q: "Does this connect to my Afterpay account?", a: "No. Float never asks for any login. You type in your instalments yourself and they stay in this browser if you use guest mode." },
      { q: "How do I enter a pay in 4 purchase?", a: "Add it under Afterpay and BNPL with the instalment amount, the next due date and a fortnightly repeat. Float places the rest of the payments for you." },
      { q: "Can I use it for other buy now pay later services?", a: "Yes. Float works with any plan that charges set amounts on set dates." },
    ],
    related: ["/float", "fortnightly-budget-planner", "bnpl-instalment-tracker", "how-much-of-my-pay-is-committed"],
  },
  {
    slug: "fortnightly-budget-planner",
    title: "Fortnightly Budget Planner for Australians",
    description: "Plan each fortnight around your payday: rent, bills, BNPL and what is left to spend. A free fortnightly budget planner in AUD.",
    h1: "Fortnightly budget planner",
    intro: "If you are paid every two weeks, a monthly budget never quite lines up. Plan one fortnight at a time instead.",
    period: "fortnight",
    sections: [
      { heading: "How to set it up", body: "Add your pay with a fortnightly repeat and the date it next lands. Add rent, bills and any instalments with their own repeat. Float works out what is due before your next pay and what is left. The sample numbers on screen show one example." },
    ],
    faqs: [
      { q: "Why plan by fortnight and not by month?", a: "Most months hold two pays, but a couple of times a year one holds three. Planning by fortnight follows your pay as it actually arrives." },
      { q: "What about bills that are monthly?", a: "Add them as monthly. Float shows them in whichever fortnight they fall due." },
      { q: "Is my data saved?", a: "Only if you turn on guest mode, and then only in this browser." },
    ],
    related: ["/float", "weekly-budget-calculator", "pay-cycle-budgeting", "monthly-bills-to-weekly"],
  },
  {
    slug: "weekly-budget-calculator",
    title: "Weekly Budget Calculator: What Is Left to Spend",
    description: "See how much you can spend this week after bills and instalments. A free weekly budget calculator in AUD with guest mode.",
    h1: "Weekly budget calculator",
    intro: "One number for this week: the pay that lands, minus the bills and instalments due.",
    period: "week",
    sections: [
      { heading: "A tip for monthly bills", body: "Got a monthly bill? To find its weekly cost, multiply by 12 and divide by 52. Halving a monthly bill is not the same as a fortnightly amount, because a year has 26 fortnights, not 24." },
    ],
    faqs: [
      { q: "What does the weekly number include?", a: "Pay landing this week, minus bills and buy now pay later instalments due in the same seven days." },
      { q: "Can I see the next fortnight or month too?", a: "Yes. Switch the tab at the top of the tool." },
      { q: "Do I need an account?", a: "No. It works straight away, and guest mode keeps your numbers in this browser only." },
    ],
    related: ["/float", "fortnightly-budget-planner", "monthly-bills-to-weekly"],
  },
  {
    slug: "pay-cycle-budgeting",
    title: "Pay Cycle Budgeting: Plan From Payday to Payday",
    description: "How to budget by pay cycle instead of by month, with a free tool for weekly, fortnightly and monthly pay in Australia.",
    h1: "Pay cycle budgeting",
    intro: "A budget works best when it starts on the day your money arrives. If you are paid weekly or fortnightly, that is rarely the first of the month.",
    period: "fortnight",
    sections: [
      { heading: "Why monthly budgets slip", body: "Rent, bills and instalments each have their own dates. When your pay does not line up with the calendar month, some periods look fine and others come up short." },
      { heading: "The bill bucket method", body: "List every bill, work out its cost per pay, and set that amount aside each payday. What remains is yours to spend until the next pay." },
      { heading: "Try it", body: "The tool below is Float, set to a fortnight. Change the sample numbers to your own." },
    ],
    faqs: [
      { q: "What is a pay cycle budget?", a: "A plan that runs from one payday to the next, rather than from the first to the last day of the month." },
      { q: "Does it work if my pay changes?", a: "Yes. Update the amount each payday and the rest follows." },
      { q: "What if I have more than one job?", a: "Add each income with its own date and repeat. Float counts whatever lands in the period you are looking at." },
    ],
    related: ["/float", "fortnightly-budget-planner", "weekly-budget-calculator", "monthly-bills-to-weekly"],
  },
  {
    slug: "bnpl-instalment-tracker",
    title: "BNPL Repayment Calculator: See Every Instalment",
    description: "List your buy now pay later plans and see which instalments land in each pay. A free BNPL repayment calculator in AUD.",
    h1: "BNPL repayment and instalment calculator",
    intro: "Several small plans can add up fast. List them once and see every payment on the date it is due.",
    period: "month",
    bnplFirst: true,
    sections: [
      { heading: "Why the dates matter", body: "Seeing the dates matters as much as the total. Two instalments in the same week as rent can leave you short even if the month looks fine." },
    ],
    faqs: [
      { q: "What counts as a BNPL plan here?", a: "Any buy now pay later purchase paid in set instalments on set dates." },
      { q: "Does it include late fees?", a: "No. Fees depend on the provider and your account, so add any you know about as a separate bill." },
      { q: "Can I remove a plan once it is paid off?", a: "Yes. Delete it from the list and the totals update straight away." },
    ],
    related: ["/float", "afterpay-budget-calculator", "how-much-of-my-pay-is-committed"],
  },
  {
    slug: "how-much-of-my-pay-is-committed",
    title: "How Much of My Pay Is Already Committed?",
    description: "Add bills and instalments to see what share of each pay is spoken for before you buy anything. A free check for Australians.",
    h1: "How much of your pay is already committed?",
    intro: "Before you spend, it helps to know how much of your pay already has a job.",
    period: "fortnight",
    committed: true,
    sections: [
      { heading: "How to read it", body: "The percentage is the share of this period's pay going to bills and instalments. There is no single right number. A lower share leaves more room for food, transport and savings." },
      { heading: "Ways to free up room", body: "Check bills with deal end dates before they roll over. Avoid starting a new instalment plan in a week that already has rent. Move a due date if your provider allows it." },
    ],
    faqs: [
      { q: "What counts as committed?", a: "Bills and buy now pay later instalments due in the period you are viewing." },
      { q: "Does it include food and fuel?", a: "Only if you add them as bills. Many people leave them out and treat what is left as their spending money." },
      { q: "Is a certain percentage too high?", a: "It depends on your costs and goals. Use the number to spot changes from one pay to the next." },
    ],
    related: ["/float", "bnpl-instalment-tracker", "50-30-20-budget-calculator"],
  },
  {
    slug: "50-30-20-budget-calculator",
    title: "50/30/20 Budget Calculator for Fortnightly Pay",
    description: "Split your take home pay into needs, wants and savings with the 50/30/20 rule. Works weekly, fortnightly or monthly in AUD.",
    h1: "50/30/20 budget calculator",
    intro: "Enter your take home pay and see it split into needs, wants and savings.",
    period: "fortnight",
    tool: "split",
    sections: [
      { heading: "What the rule means", body: "Needs are the costs you cannot skip, like rent, groceries and transport. Wants are the extras. Savings includes paying down debt. It is a starting point, not a strict rule." },
      { heading: "Compare with your real bills", body: "Your actual bills may be more or less than half. Float below shows the real figure for this period." },
    ],
    faqs: [
      { q: "Should I use my pay before or after tax?", a: "After tax. Use the amount that lands in your account." },
      { q: "Do BNPL instalments count as needs or wants?", a: "It depends on what you bought. Many people count them by the purchase, so a fridge is a need and a jacket may be a want." },
      { q: "What if my needs are more than 50%?", a: "That is common when rent is high. Adjust the split to suit you and watch the trend over a few pays." },
    ],
    related: ["/float", "fortnightly-budget-planner", "how-much-of-my-pay-is-committed"],
  },
  {
    slug: "monthly-bills-to-weekly",
    title: "Convert Monthly Bills to Weekly or Fortnightly",
    description: "Turn monthly, quarterly or yearly bills into weekly and fortnightly amounts so your budget matches your pay. Free and quick.",
    h1: "Monthly to weekly and fortnightly bill converter",
    intro: "Type a bill and how often it is charged. See what it costs per week and per fortnight.",
    period: "week",
    tool: "convert",
    sections: [
      { heading: "A common mistake", body: "Halving a monthly bill does not give you the fortnightly cost. A year has 12 months but 26 fortnights, so the right sum is the monthly amount times 12, divided by 26." },
    ],
    faqs: [
      { q: "How do I turn a monthly bill into a weekly amount?", a: "Multiply it by 12, then divide by 52." },
      { q: "And into a fortnightly amount?", a: "Multiply it by 12, then divide by 26." },
      { q: "What about a quarterly bill?", a: "Multiply it by 4 to get the yearly cost, then divide by 52 for weekly or 26 for fortnightly." },
    ],
    related: ["/float", "weekly-budget-calculator", "fortnightly-budget-planner"],
  },
];

export const floatPageBySlug = (slug: string) => FLOAT_PAGES.find((p) => p.slug === slug);
