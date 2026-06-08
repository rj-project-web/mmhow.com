#!/usr/bin/env node
/**
 * Publish one new article per category to production.
 * Usage: node --env-file=.env scripts/publish-category-batch.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const API_KEY = process.env.MMHOW_API_KEY
const BASE = process.env.MMHOW_API_BASE || 'https://www.mmhow.com'

if (!API_KEY) {
  console.error('MMHOW_API_KEY required in .env')
  process.exit(1)
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const COVERS = {
  selfMedia: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80',
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
  social: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80',
  ecommerce: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
  info: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
  freelance: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
  wfh: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1200&q=80',
  student: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
  invest: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
  knowledge: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
}

const BODY_IMG = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80'

const ARTICLES = [
  {
    title: 'From Traffic Anxiety to Wealth Compounding: 4 Pillars of a Profitable Creator Business',
    slug: 'four-pillars-profitable-creator-business',
    category: 'self-media--content-creator-economy',
    sourceUrl: 'https://news.qq.com/rain/a/20251220A06I8B00',
    sourceTitle: '从"流量焦虑"到"财富复利"：普通人做自媒体，到底该怎么赚钱？',
    sourcePlatform: '腾讯新闻',
    featuredImage: COVERS.selfMedia,
    description: `## The shift most creators miss

Many new creators obsess over views, then panic when ad revenue stalls. The more durable model treats content as the front door to a **one-person business** — not a lottery ticket.

You are not selling posts. You are selling a **trusted solution** to a specific problem.

## Pillar 1: Trust beats traffic

Traffic is rented. Trust is owned.

Pick one audience with a recurring pain — budgeting, career pivots, local food, parenting hacks — and answer it consistently for 90 days. Sponsors and buyers follow clarity, not virality.

## Pillar 2: Customers, not clicks

A mailing list, WeChat community, or paid newsletter is worth more than a spike in impressions. One thousand people who open every message beat one million passive scrollers.

## Pillar 3: Productize your expertise

Package what you already explain for free:

- A $29 template bundle
- A $199 mini-course
- A $999 cohort with office hours

Each layer filters serious buyers without requiring a team.

## Pillar 4: Use AI as a production crew

AI can draft outlines, repurpose long posts into shorts, and summarize interviews. You still provide judgment, stories, and accountability — the parts machines cannot fake.

## Four monetization lanes that actually compound

1. **Brand deals** — once your niche is obvious
2. **Affiliate commissions** — only products you would use
3. **Your own offers** — highest margin
4. **Courses and coaching** — best LTV when delivery is tight

## A 30-day starter plan

| Week | Focus |
|------|-------|
| 1 | Interview 5 people in your niche; list their top 3 frustrations |
| 2 | Publish 4 posts solving frustration #1 |
| 3 | Offer a free checklist; collect emails |
| 4 | Pre-sell a $49 workshop to 10 people |

If pre-sales fail, fix positioning before buying ads.

## Bottom line

Creator wealth is a **byproduct of compounding trust**. Stop chasing random trends. Build four pillars — trust, owned audience, productized expertise, and AI-assisted output — and revenue becomes predictable instead of emotional.`,
    images: [
      { url: BODY_IMG, alt: 'Creator business growth chart on laptop', caption: 'Figure 1: Compounding trust beats one-off viral hits.' },
    ],
  },
  {
    title: 'How I Built an AI System That Takes Client Orders While I Commute',
    slug: 'ai-client-intake-system-for-freelancers',
    category: 'ai-powered-side-hustles',
    sourceUrl: 'https://zhuanlan.zhihu.com/p/1986819573580838225',
    sourceTitle: '早高峰的地铁里，我的 AI 已经帮我接了 2 个单',
    sourcePlatform: '知乎',
    featuredImage: COVERS.ai,
    description: `## Why freelancers need an intake system

If you sell design, copy, editing, or consulting, you already know the trap: clients message at random hours, scope is vague, and you lose deals while you are in meetings or on the subway.

An **AI intake layer** does not replace you. It **structures demand** before you ever open WeChat.

## What the system does

Route every inquiry through one form that captures:

- Project type
- Deadline
- Budget range
- Revision expectations
- Remote vs on-site preference

Then AI performs three jobs automatically:

1. **Classify** the request (copy vs design vs strategy)
2. **Suggest a price band** using your rate card
3. **Draft a collaboration brief** so the client sees how you think

You review on your schedule — not theirs.

## Stack that works in 2025

| Layer | Tool examples |
|-------|----------------|
| Form | Tally, Feishu forms, Typeform |
| Logic | Zapier, Make, Coze workflows |
| Drafting | Claude, ChatGPT with fixed prompts |
| CRM | Notion, Airtable, or a simple spreadsheet |

Keep human approval on anything involving money or legal terms.

## Sample prompt for quote drafts

\`\`\`
You are a senior freelancer. Given the client brief below, return:
1) project category
2) estimated hours
3) quote range in USD
4) three clarifying questions
5) a 120-word collaboration outline
\`\`\`

## Results you should expect

Week 1: fewer back-and-forth messages  
Week 4: higher close rate because clients feel organized  
Month 3: enough data to raise prices on your top two categories

One operator reported closing two deals **before arriving at the office** — not because AI negotiated, but because leads were qualified overnight.

## Guardrails

- Never auto-send final contracts
- Log every AI quote for audit
- Cap discounts without your PIN
- Reply within 24h even if AI drafted first

## Who this fits best

Process-heavy freelance work: brand kits, landing pages, short video batches, Notion setups, pitch decks.

## Start tonight

1. Write your rate card in a Google Doc  
2. Build a 6-field intake form  
3. Connect one AI prompt that outputs a quote range  
4. Test with three past clients

You will feel less "always on" within a week — and that is the real income multiplier.`,
    images: [
      { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', alt: 'Freelancer dashboard with client pipeline metrics' },
    ],
  },
  {
    title: 'Xiaohongshu Buyer Commerce: Why Smaller Creators Can Outearn Mega-Influencers',
    slug: 'xiaohongshu-buyer-commerce-small-creator-advantage',
    category: 'social-media-monetization-red--douyin',
    sourceUrl: 'https://news.qq.com/rain/a/20250508A09B7A00',
    sourceTitle: '虽然"红猫"上线了，但小红书的赚钱逻辑还在继续打磨',
    sourcePlatform: '腾讯新闻',
    featuredImage: COVERS.social,
    description: `## RED is not Douyin — and that is the opportunity

Douyin rewards speed, hooks every 30 seconds, and impulse checkout. **Xiaohongshu (RED)** rewards narrative, trust, and slower decisions.

Copying Douyin pacing on RED usually destroys ROI. The platform's buyer-commerce model favors **curators** over screamers.

## The buyer-commerce flywheel

1. Notes that teach or demonstrate real usage  
2. Live streams with long product explanations (5–10 minutes each)  
3. Shop listings that feel like a friend's recommendation  
4. Delayed conversions — many buyers purchase **days after** the live session

Track **7-day post-live sales**, not just live-room GMV.

## Why "small" accounts win

Platforms now measure **net creator income per hour**, not raw follower count. A creator with 150K fans running disciplined twice-weekly live sessions can outperform a million-fan account that posts sporadically.

High-frequency, story-driven live commerce builds:

- Repeat viewers
- Higher trust
- Better supplier deals

## RED vs Douyin decision matrix

| Signal | Lean RED | Lean Douyin |
|--------|----------|-------------|
| Price point | $30–$300 | Under $30 |
| Product story | Strong | Weak |
| Demo time needed | 5+ minutes | Under 60 seconds |
| Brand building | Critical | Optional |

## Operational checklist

- **Shop page:** write like a buyer, not a warehouse  
- **Live cadence:** fixed weekly slot beats random marathons  
- **KOC network:** 10–20 micro creators for authentic reviews  
- **Search:** own category keywords in notes and shop titles  
- **Private domain:** move high-LTV buyers to WeChat for launches

## Metrics that matter

1. Average watch time  
2. Followers gained per live  
3. Add-to-cart rate  
4. 7-day delayed GMV  
5. Repeat purchase rate

## Practical 30-day launch

| Days | Action |
|------|--------|
| 1–7 | Audit 20 competitor notes; list 10 content gaps |
| 8–14 | Publish 6 tutorial notes; soft-promote one hero SKU |
| 15–21 | Run 2 live sessions; keep each SKU on screen 8+ minutes |
| 22–30 | Recruit 5 KOCs; bundle a limited "live-only" offer |

## Takeaway

On RED, you are not fighting for the loudest microphone. You are building **buyer trust at human speed** — and that is why smaller, consistent creators are quietly outearning traditional mega-influencers.`,
    images: [
      { url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=80', alt: 'Social commerce live streaming setup' },
    ],
  },
  {
    title: '1688 Dropshipping in 2025: Supplier Sites and Traps Every Beginner Should Know',
    slug: '1688-dropshipping-2025-supplier-guide',
    category: 'e-commerce--dropshipping',
    sourceUrl: 'https://zhuanlan.zhihu.com/p/1911457243104261878',
    sourceTitle: '15年电商人说点大实话：2025年想做一件代发，这30个货源网站和避坑指南收好不谢',
    sourcePlatform: '知乎',
    featuredImage: COVERS.ecommerce,
    description: `## Dropshipping still works — sloppy sourcing does not

2025 dropshipping is **curated**, not "upload 500 SKUs and pray." Margins live in supplier quality, shipping honesty, and SKU discipline.

## Supplier tiers worth bookmarking

**Tier 1 — factories & wholesale**
- 1688.com (filter for verified factories and repeat-buyer badges)
- Pinduoduo wholesale channel for household goods

**Tier 2 — category specialists**
- Regional apparel hubs for fashion
- Local industrial clusters for home gadgets

Always order samples before scaling ads.

## Margin math (non-negotiable)

Example SKU:

| Item | Amount |
|------|--------|
| Supplier + shipping | $9 |
| Platform fee | $2 |
| Ads | $4 |
| Returns reserve | $1 |
| **Target sale price** | **$29+** |

If net margin falls below 25% after ads, fix pricing or change SKU.

## Four traps that kill beginners

### 1. Fake "free shipping"

Vendors advertise nationwide free shipping but surcharge remote zones. Disclose exceptions in your listing footer.

### 2. Phantom inventory

A listing shows 5,000 units; reality is 15-day production. Ask suppliers for morning SKU snapshots.

### 3. Slow after-sales

Require:
- Response under 2 hours
- Clear defect policy
- QC photos before dispatch

### 4. Image copyright

Use supplier photos only with written permission. Shoot your own hero image when possible.

## Selection heuristics

- Light, durable, non-fragile
- Repeat purchase potential (pet, kitchen, organization)
- Search trend up 30%+ quarter over quarter
- Fewer than 800 similar listings on your target marketplace

## Tooling stack

- ERP: sync orders to 1688 automatically
- Analytics: track refund rate per SKU
- Creative: short video demos beat static catalogs

## 14-day test sprint

1. Pick 3 SKUs  
2. Order samples  
3. List one per marketplace  
4. Spend $10/day on content ads  
5. Kill any SKU with refunds >8%  

## Bottom line

Dropshipping is a **supply-chain job** disguised as marketing. Master 1688 sourcing, ruthless SKU math, and after-sales SLAs — then scale.`,
    images: [
      { url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80', alt: 'E-commerce order fulfillment workflow' },
    ],
  },
  {
    title: 'Building an AI Digital Product Business: Zero Inventory, Infinite Scale',
    slug: 'ai-digital-product-business-zero-inventory',
    category: 'information-arbitrage--digital-products',
    sourceUrl: 'https://www.woshipm.com/ai/6296599.html',
    sourceTitle: '一个普通人也能复制的 AI 数字生意：5 分钟生产、全球销售、可无限扩展',
    sourcePlatform: '人人都是产品经理',
    featuredImage: COVERS.info,
    description: `## Information arbitrage meets AI production

The best digital arbitrage plays in 2025 share one trait: **you assemble value faster than the buyer could alone.**

AI removed the old bottlenecks — illustration, layout, copy, localization — so individuals can ship templates, prompt packs, and micro-guides in days, not months.

## Six product types with real demand

1. **Prompt libraries** ($15–$79) — niche-specific, tested outputs  
2. **Notion / Excel systems** ($19–$49) — finance, job search, creator ops  
3. **Short ebooks** ($9–$29) — one painful problem, one clear outcome  
4. **Design kits** ($12–$39) — wedding invites, kid party packs, resume sets  
5. **Swipe files** ($29–$99) — ads, hooks, email sequences by industry  
6. **Checklists + SOPs** ($7–$19) — great entry offer

## Validate before you build

Publish a teaser post describing outcomes, not files:

> "I am packaging the exact Airbnb pricing spreadsheet I used to raise occupancy 18%. Comment 'SHEET' if you want early access."

If 10+ people respond, build. If not, pivot topic.

## Where to sell

| Channel | Best for |
|---------|----------|
| Gumroad / Lemon Squeezy | Global, English products |
| Xiaohongshu + DM checkout | Visual templates |
| WeChat + micro-store | Highest conversion, zero platform fee |
| Etsy | Art-heavy kits |

## Production workflow (about 5 hours)

1. Outline outcomes in bullets  
2. Generate drafts with AI  
3. Manually verify every example output  
4. Brand cover in Canva  
5. Record a 3-minute walkthrough GIF  

## Pricing logic

Price on **time saved**, not page count. If your kit saves 6 hours for a freelancer billing $40/hour, $49 is an easy yes.

## Avoid commodity death

- Narrow the niche ("Etsy SEO for vintage clothing" beats "SEO templates")
- Bundle implementation video
- Offer 7-day email support

## 30-day revenue plan

| Week | Milestone |
|------|-----------|
| 1 | Teaser + waitlist |
| 2 | Ship v1 to first 10 buyers |
| 3 | Collect testimonials |
| 4 | Raise price 20% and add upsell |

## Key insight

Digital products are **information arbitrage with zero logistics**. AI is the factory; your taste and specificity are the moat.`,
    images: [
      { url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80', alt: 'Digital product storefront on laptop' },
    ],
  },
  {
    title: '7 Survival Rules I Learned Quitting Big Tech to Go Solo',
    slug: 'seven-rules-quitting-big-tech-going-solo',
    category: 'freelancing--remote-work',
    sourceUrl: 'https://www.cnblogs.com/itech/p/20036295',
    sourceTitle: 'AI 时代，我辞掉了大厂工作去做独立开发者——血泪换来的 7 条生存法则',
    sourcePlatform: '博客园',
    featuredImage: COVERS.freelance,
    description: `## Solo is possible — naive solo is expensive

AI lets one person ship what used to require a squad. But **shipping ≠ revenue**. Most indie builders earn under $5K/month in year one.

These seven rules come from operators who left corporate jobs and stayed solvent.

## Rule 1: Do not quit on hype

Keep your salary until side income covers **50%+ of expenses** for three consecutive months. Run experiments nights and weekends first.

## Rule 2: Distribution before code

A landing page with a waitlist beats a private beta no one sees. If ten strangers will not leave an email, the product is not validated.

## Rule 3: One offer, one avatar

"SaaS for everyone" is a slow death. Pick one painful job:

- Resume overhaul for data analysts
- Notion CRM for real estate teams
- Compliance checklists for Shopify stores

## Rule 4: Price like a business, not a hobby

Underpricing attracts scope creep. Publish packages with boundaries and paid change orders.

## Rule 5: Build in public — selectively

Share progress, metrics, and lessons on X, Reddit, or niche forums. Hide your roadmap secrets, show your craftsmanship.

## Rule 6: Automate ops early

Invoicing, onboarding emails, meeting scheduling, and proposal templates should run before you hit 10 clients.

## Rule 7: Protect health and runway

Set core work hours, keep 6–12 months of expenses in cash, and track **effective hourly rate** weekly.

## Income stack for remote freelancers

| Stage | Focus |
|-------|-------|
| 0–3 months | Project work on Upwork + warm network |
| 3–9 months | Productized service with fixed scope |
| 9–18 months | Digital product or retainer layer |

## Red flags to fire clients

- Refuses deposit
- "Quick favor" scope every week
- Disrespects async boundaries
- Pays late twice

## Practical next steps

1. List 20 people who already asked you for help  
2. Offer a $500 fixed package solving one task  
3. Deliver in 7 days, ask for referrals  
4. Repeat until waitlist exists

Going solo is not an escape from work — it is a upgrade to **owning the system**. These rules keep the upgrade from becoming a trap.`,
    images: [
      { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80', alt: 'Independent developer workspace' },
    ],
  },
  {
    title: '8 Zero-Barrier Side Hustles You Can Run From Home in 2025',
    slug: 'eight-zero-barrier-side-hustles-from-home-2025',
    category: 'work-from-home--micro-business',
    sourceUrl: 'https://www.sohu.com/a/940982924_122449176',
    sourceTitle: '2025 普通人副业指南：8 个零门槛方向，在家也能高效创收',
    sourcePlatform: '搜狐',
    featuredImage: COVERS.wfh,
    description: `## Home-based income is mainstream now

Between rising living costs and remote-friendly tools, **work-from-home side hustles** shifted from backup plan to standard household strategy.

Below are eight directions with low startup cost and realistic entry paths.

## 1. AI-assisted micro content

Use AI to draft short articles, captions, or 60-second tips — then add personal experience. Monetize via platform revenue shares or brand deals once niche is clear.

## 2. Community group-buy lead

Partner with local grocery platforms as a neighborhood pickup captain. You earn service fees without holding inventory. Success requires WeChat group ops and reliable communication.

## 3. Digital templates & planners

Sell printable planners, meal prep sheets, or kids' activity packs on Etsy or domestic marketplaces. One design can sell for years.

## 4. Remote admin & data support

SMBs outsource inbox triage, CRM cleanup, and reporting. Start on freelance marketplaces; graduate to monthly retainers.

## 5. Online tutoring & skill coaching

Teach Excel, interview prep, or instrument basics over Zoom. Package 4-session bundles instead of single hours.

## 6. Handmade & made-to-order crafts

Even small volumes work when positioning is gift-focused (custom pet portraits, engraved items). Price for labor, not just materials.

## 7. Resale & clearance arbitrage

Source clearance goods locally; relist where photos and descriptions are weak. Information gap is the product.

## 8. Pet & home services coordination

Match busy owners with walkers, cleaners, or plant care — take a coordination fee. Low tech, high trust.

## Pick the right hustle for your life

| If you have… | Start with |
|--------------|------------|
| Evenings only | AI micro content or templates |
| Strong local ties | Group-buy lead or pet coordination |
| Analytical skills | Remote admin retainers |
| Craft skills | Made-to-order shop |

## Anti-scam filter

Walk away if they demand:

- Upfront "training fees"
- Guaranteed income claims
- Unclear payout rules

Legit hustles pay **you**, not the other way around.

## 14-day launch

1. Choose one hustle aligned with existing skills  
2. Publish one proof-of-work sample  
3. Offer intro pricing to three beta customers  
4. Document turnaround time and margins  
5. Decide scale or switch

Home micro-businesses win on **consistency and trust**, not secret hacks.`,
    images: [
      { url: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1200&q=80', alt: 'Home office side hustle setup' },
    ],
  },
  {
    title: '3 Student Side Hustles That Build Skills Instead of Burning Time',
    slug: 'three-student-side-hustles-build-skills-not-burn-time',
    category: 'side-hustles-for-students--beginners',
    sourceUrl: 'https://zhuanlan.zhihu.com/p/1936471029699540252',
    sourceTitle: '大学生亲测靠谱兼职推荐！',
    sourcePlatform: '知乎',
    featuredImage: COVERS.student,
    description: `## Stop trading time for pocket change

Flyer distribution and mystery shopping pay little and teach less. In 2025, students with AI tools can build **three assets** while earning:

- Skills
- Relationships
- Reputation

Here are three hustles that fit class schedules.

## Hustle 1: Niche content operator

Pick a micro topic you already study — campus productivity, budget meals, internship prep.

Workflow:

1. Draft posts with AI  
2. Add real screenshots and opinions  
3. Publish on RED, Bilibili, or TikTok  
4. Monetize via ads, affiliate tools, or paid templates

Low followers can still win if the niche is sharp.

## Hustle 2: AI design & photo cleanup

Students with taste (not necessarily pro designers) offer:

- Resume layout fixes ($15–$30)
- Dorm photo enhancements
- Simple poster kits for clubs

Deliver in 24 hours. One satisfied club president refers three more.

## Hustle 3: Lightweight tech gigs

Even beginners can sell:

- Spreadsheet automation
- Simple landing pages
- Data cleaning for local shops

Use AI coding assistants, but **test every script** before delivery.

## Weekly time budget

| Activity | Hours |
|----------|-------|
| Classes & study | priority |
| Side hustle | 6–8 |
| Rest | non-negotiable |

If grades slip, pause the hustle — reputation lasts longer than one semester of tips.

## Pricing starter grid

| Service | Beginner price |
|---------|----------------|
| Resume polish | $15 |
| Club poster pack | $25 |
| 3-page Notion setup | $40 |
| Spreadsheet automation | $60 |

Raise 15% after five five-star reviews.

## Safety checklist

- Never pay to "join" a program  
- Use platform escrow when possible  
- Invoice through parents' business entity only if legally cleared in your region  

## 30-day student plan

Week 1: publish 4 free samples  
Week 2: offer student discount bundles  
Week 3: collect testimonials  
Week 4: add one small digital product for passive sales

The goal is not just extra cash — it is graduating with a **portfolio that hires you**.`,
    images: [
      { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80', alt: 'Student studying with laptop on campus' },
    ],
  },
  {
    title: 'The "Boring" Path to Passive Income: Index Funds + REITs',
    slug: 'boring-path-passive-income-index-funds-reits',
    category: 'investment--passive-income',
    sourceUrl: 'https://news.qq.com/rain/a/20251207A05SFI00',
    sourceTitle: '财务自由最笨的方法：每月雷打不动3000块，买入"这两个"东西',
    sourcePlatform: '腾讯新闻',
    featuredImage: COVERS.invest,
    description: `## Flashy trades vs compounding systems

Markets reward patience more than prediction. A durable passive-income stack for ordinary investors combines:

1. **Broad index funds** for long-term growth  
2. **REITs or dividend assets** for cash flow  

This is not exciting. That is the point.

## Why index funds anchor the portfolio

Index funds track the market average instead of betting on one manager's luck. Benefits:

- Lower fees than active funds
- No style drift when managers leave
- Automatic diversification

Pair a large-cap index (e.g., CSI 300, S&P 500) with a mid/growth index (e.g., CSI 500, Nasdaq 100) for balance.

## How dollar-cost averaging works

Invest a **fixed amount on a fixed schedule** — ideally right after payday.

When markets fall, the same contribution buys more shares. When markets rise, your older shares appreciate. Volatility becomes an ally over 10+ years.

## Where REITs fit

REITs expose you to rent-generating assets — logistics, apartments, infrastructure — with regular distributions. They can cover monthly expenses while equities compound.

Illustrative split for a $300/month budget:

| Bucket | Monthly | Role |
|--------|---------|------|
| Broad index | $200 | growth |
| REIT / dividend | $100 | cash flow |

Adjust to your currency and risk tolerance.

## Rules that prevent self-sabotage

1. Only invest money you will not need for 3–5 years  
2. Keep 3–6 months of expenses in cash first  
3. Automate contributions — willpower is unreliable  
4. Rebalance yearly, not daily  
5. Pause contributions in extreme overvaluation; do not panic sell lows

## Sample 10-year outcome (illustrative)

Consistent investing of ~$300/month with moderate market returns and reinvested dividends can turn disciplined contributions into a meaningful portfolio **without** stock-picking stress.

Add REIT distributions and you may eventually cover baseline living costs — the definition of passive income for most households.

## Common mistakes

- Chasing last year's top fund  
- Stopping contributions after one red quarter  
- Ignoring fees and taxes  
- Using leverage to "catch up"

## Action checklist

1. Open a low-fee brokerage account  
2. Set automatic monthly transfers  
3. Choose two index funds + one REIT exposure  
4. Write an investment policy on one page  
5. Review quarterly, trade rarely

Wealth is rarely built by genius trades. It is built by **boring repetition** — the kind you can sustain for a decade.`,
    images: [
      { url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&q=80', alt: 'Long-term investment planning chart' },
    ],
  },
  {
    title: 'Knowledge Monetization in 2025: From Selling Courses to Running a One-Person Company',
    slug: 'knowledge-monetization-one-person-company-2025',
    category: 'knowledge-monetization--online-courses',
    sourceUrl: 'https://news.qq.com/rain/a/20250806A06W2Y00',
    sourceTitle: '平台抛弃你时，连通知都没有！知识付费的下一站：把自己活成一家"一人公司"',
    sourcePlatform: '腾讯新闻',
    featuredImage: COVERS.knowledge,
    description: `## The course gold rush cooled — solutions didn't

Generic "how to succeed" courses lost trust. What still grows is **outcome-based knowledge businesses** run by one operator with tight delivery.

## Three models that still work

### 1. Vertical expertise

Teach one specific transformation:

- "From analyst to product manager in 90 days"
- "RED shop setup for bakeries"
- "Notion finance system for freelancers"

Broad motivation content is crowded. Narrow wins.

### 2. Subscription + community

Monthly memberships outperform one-off purchases when you provide:

- Office hours
- Template updates
- Peer accountability

Continuity beats launch spikes.

### 3. B2B knowledge products

Package internal know-how for companies:

- Onboarding playbooks
- Sales scripts
- Compliance training

Higher ticket, longer sales cycle, but stickier revenue.

## Product ladder

| Tier | Offer | Price band |
|------|-------|------------|
| Free | Newsletter / short videos | $0 |
| Entry | Templates or toolkit | $9–$49 |
| Core | Cohort course | $199–$999 |
| Premium | 1:1 advisory | $2K+ |

Move buyers up only after they get results at the current tier.

## AI's real role

Use AI for:

- Outline generation
- Quiz creation
- FAQ bots
- Sales page drafts

Keep human time for feedback, live sessions, and strategic calls — the parts people actually pay for.

## Delivery metrics to track

1. Completion rate  
2. Time-to-first-win  
3. Refund rate  
4. Referral rate  
5. 90-day upsell rate

If completion is under 40%, shorten modules before running more ads.

## 60-day launch sequence

**Days 1–15:** publish 10 free lessons solving one micro-problem  
**Days 16–30:** pre-sell a $49 workshop to 20 seats  
**Days 31–45:** deliver live, collect case studies  
**Days 46–60:** open $299 cohort with testimonials

## Platform risk management

Algorithms change overnight. Own:

- Email list
- WeChat community
- Payment relationship

Treat social platforms as **top-of-funnel**, not your headquarters.

## Bottom line

Knowledge monetization in 2025 is not dead — it matured. Winners look like **lean one-person companies** shipping measurable outcomes, not celebrities selling hype.`,
    images: [
      { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80', alt: 'Online course and knowledge product planning' },
    ],
  },
]

async function publish(article) {
  const res = await fetch(`${BASE}/api/agent/articles`, {
    method: 'POST',
    headers: {
      Authorization: `users API-Key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...article,
      status: 'published',
      descriptionFormat: 'markdown',
    }),
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text }
  }
  return { ok: res.ok, status: res.status, json }
}

const results = []

for (const article of ARTICLES) {
  const label = article.category
  process.stdout.write(`Publishing ${label}… `)
  try {
    const { ok, status, json } = await publish(article)
    if (!ok) {
      console.log(`FAIL ${status}`)
      results.push({ category: label, success: false, status, error: json })
      continue
    }
    console.log(`OK #${json.article?.id} ${json.article?.slug}`)
    results.push({
      category: label,
      success: true,
      id: json.article?.id,
      slug: json.article?.slug,
      url: json.article?.url,
      sourceMappingUpdated: json.sourceMappingUpdated,
    })
  } catch (err) {
    console.log(`ERROR ${err.message}`)
    results.push({ category: label, success: false, error: err.message })
  }
}

const out = join(root, 'scripts/publish-category-batch-results.json')
writeFileSync(out, JSON.stringify(results, null, 2))
console.log(`\nDone: ${results.filter((r) => r.success).length}/${ARTICLES.length} published`)
console.log(`Results → ${out}`)

process.exit(results.every((r) => r.success) ? 0 : 1)
