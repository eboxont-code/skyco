# SkyCo - As Above, So Below

## Project documentation

- **[Master plan and checklist](MASTER_PLAN.md)** — authoritative website hardening, shared-service and Android delivery plan.
- **[Working web backlog](roadmap.md)** — dated historical website tasks; preserve completed history.
- **[Agent instructions](AGENTS.md)** — coding constraints, product invariants and Git/Lovable rules.

The current live hub is **https://skyco.online**. The Android project is planned as a separate Flutter client under `apps/skyco_app/`; the existing website remains the canonical web experience.

Welcome to SkyCo - As Above, So Below.

This is more than just another website with tools. SkyCo is a place built to genuinely help you move through your days with a little more ease, a little more clarity, and a little more energy to go after whatever matters to you.

Life moves fast. Some days it feels like you’re juggling too many things at once — remembering what’s in the fridge, keeping track of money, staying on top of your goals, taking care of your body and mind, and still trying to make progress on the things that actually matter to you. It can get heavy. SkyCo exists because small, practical support can make a real difference. Not in a loud, overwhelming way. In a steady, encouraging way that actually fits into real life.

At its heart, SkyCo is here to lift people up. That means different things for different people. For some it’s getting better organised with daily tasks. For others it’s building healthier habits, finding motivation on tough days, or simply having simple tools that remove friction from everyday life. Whether your focus is on your body, your mind, your personal growth, or just getting through the week feeling a bit more in control — you’re welcome here.

We started SkyCo with a simple belief: people don’t need more complicated systems. They need things that actually work, that feel good to use, and that respect their time and energy. That’s why we’re building practical, easy-to-use tools you can reach for whenever you need them.

On SkyCo you’ll find helpful daily tools designed to make life smoother. A clean grocery list that you can build quickly and take with you. Simple budgeting and expense trackers that don’t require a finance degree to understand. A calendar you can use right in your browser to keep important dates and plans visible. A currency converter for when you’re dealing with different countries or just want to know what something actually costs. Small but genuinely useful things that remove little points of stress from your day.

These tools are made for real people living real lives — not just for people who already have perfect systems. They’re simple on purpose. Clean. Easy to pick up and put down. The kind of tools you’ll actually use instead of ones that sit there looking fancy but never get opened.

But SkyCo is more than just a collection of tools.

We also want this to be a place where you can ask for small, genuine help. Sometimes you just need a quick answer, a suggestion, or someone to point you in a better direction. That’s why we’ve kept space for you to ask simple questions or make small requests. It’s not the main feature — it’s a quiet, human part of the site. Because real help often starts with someone actually listening.

Alongside the practical tools, you’ll find motivational quotes, uplifting thoughts, and small pieces of content designed to give you a gentle push forward. Not empty positivity. Real, energising reminders that you’re capable of doing hard things, that progress doesn’t have to be perfect, and that taking care of yourself matters. The tone here is energetic and motivating — bright, warm, and encouraging. When you land on SkyCo, we want you to feel like someone is quietly cheering you on.

This isn’t about forcing one version of success on you. Success here looks different for everyone. Maybe it’s getting stronger in your body. Maybe it’s protecting your peace of mind. Maybe it’s building something of your own, improving your habits, or simply feeling more capable in your daily life. SkyCo doesn’t decide what “great” looks like for you. We just want to give you tools, support, and a bit of motivation while you figure it out and move toward it.

We’re building this the honest way — starting small, staying focused on what actually helps, and growing based on what real people need. No big team behind the scenes right now. Just a genuine effort to create something useful. That’s why everything here is designed to be straightforward and human. We’re not trying to sell you a perfect life. We’re trying to give you small, practical lifts that add up over time.

SkyCo is for anyone who wants to feel a little more supported in their day-to-day. Whether you’re here for a quick grocery list, to track your spending more clearly, to get a bit of motivation on a hard day, or just to explore tools that might make life feel lighter — you belong here.

We believe that when people have access to simple, good tools and a bit of genuine encouragement, they show up better for themselves and the people around them. That’s the real goal. Not perfection. Not some unrealistic version of productivity. Just steady, meaningful progress that feels good.

As SkyCo grows, more tools and features will be added — always with the same focus: practical help that respects your time, supports your goals (whatever they are), and keeps that energetic, motivating spirit alive. We’re not in a rush to add everything at once. We’d rather build things properly and keep the heart of the site true to what matters — helping real people live better, one small lift at a time.

So whether you’re here for the first time or you’ve been using the tools for a while, thank you for being part of this. SkyCo is here for you — to make certain parts of life easier, to give you a quiet boost when you need it, and to remind you that you’re capable of building the life you actually want.

This is your space to feel supported.

Welcome to SkyCo.

We’re genuinely glad you’re here.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://skyco.online

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3706605c-043c-43bf-a5d9-c50fe65c055d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

The repository commits `bun.lock` and `bunfig.toml`, so use Bun for the local install workflow. Avoid creating a second package-manager lockfile.

```sh
git clone https://github.com/eboxont-code/skyco.git
cd skyco
bun install --frozen-lockfile
bun run dev
```

Before submitting changes, run the available checks:

```sh
bun run lint
bun run test
bun run build
```

The repository pins **Bun 1.4.4** in `package.json` and uses the committed `bun.lock`. The `test` script runs all existing TypeScript tests with Bun's test runner. [GitHub Actions CI](.github/workflows/ci.yml) runs the frozen install, lint, test and production build checks for pull requests and pushes to `main`.
