#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

API_KEY="${MMHOW_API_KEY:?MMHOW_API_KEY required}"
BASE="${MMHOW_API_BASE:-https://www.mmhow.com}"

svg_b64() {
  base64 < "public/article-assets/$1" | tr -d '\n'
}

publish_json() {
  curl -sS --max-time 120 -X POST "${BASE}/api/agent/articles" \
    -H "Authorization: users API-Key ${API_KEY}" \
    -H "Content-Type: application/json" \
    -d @"$1"
}

# Article 1 body (markdown, no inline images — figures appended via images[])
read -r -d '' BODY1 <<'EOF' || true
## Overview

Can a regular person use AI tools to earn an extra **$1,000 per day** — about **$30,000 per month**?

Yes, but not by installing an app and waiting for deposits. AI is a **leverage tool**. It amplifies skills you already have: writing, video, design, setup work, or teaching.

Freelancers who use AI tools consistently report **meaningfully higher output** than those who do not. The gap is not magic — it is **speed, volume, and delivery quality**.

## What AI Side Hustles Are (and Are Not)

**They are:**
- Faster delivery of services clients already pay for
- One person doing what used to require a small team
- Repeatable workflows you improve over 2–4 weeks

**They are not:**
- Passive income with zero learning
- "Fully automated money" with no quality control
- A replacement for domain knowledge

## Path 1: AI-Assisted Writing ($300–$1,500/day potential)

**Best for:** Anyone who can write clear, useful English.

**Workflow:**
1. Pick a niche (parenting, fitness, SaaS, pets, finance basics)
2. Use AI for first drafts; **you** edit for voice, facts, and examples
3. Deliver on Upwork, Fiverr, or direct clients

| Deliverable | Typical rate | With AI, daily volume |
|-------------|--------------|------------------------|
| Social posts | $50–100 each | 15–20 posts |
| Blog articles | $200–500 each | 3–5 articles |
| Product copy | $100–300 each | 5–8 pages |

**Key rule:** Never ship raw AI output. Editing is the product.

## Path 2: AI Short-Form Video ($500–$2,000/day potential)

**Best for:** People comfortable with short video formats.

**Stack:** Script (ChatGPT/Claude) → voice (ElevenLabs / CapCut) → visuals (stock b-roll) → edit in CapCut.

**Monetization:**
- Manage 3–5 client accounts ($3,000–8,000/month each)
- Run your own channels (ads, affiliates, digital products)

## Path 3: AI Setup & Agent Services ($500–$1,500/day)

**Best for:** Patient learners who can follow technical tutorials.

Open-source AI agents are popular but **hard to deploy** for non-technical users. You can charge for installation, API setup, and basic automation recipes.

Typical project fees: **$200–$800** per setup, plus optional monthly support.

## Paths 4–7 (Summary)

| Path | Focus | Daily range |
|------|-------|-------------|
| **4. Automation outsourcing** | Workflows for small businesses | $800–2,000 |
| **5. AI design** | Thumbnails, ads, product mockups | $500–1,500 |
| **6. AI training** | Workshops, templates, cohorts | $1,000–5,000 |
| **7. Translation & localization** | Cross-border content | $500–1,500 |

## Which Path Should You Pick?

Have writing skills? → Path 1. Like video? → Path 2. Can follow technical docs? → Paths 3 or 4. Strong visual taste? → Path 5. Already teach or consult? → Path 6. Bilingual? → Path 7.

Commit to **one path for 90 days** before adding another.

## FAQ

**Do I need to code?** No for Paths 1, 2, 5, 6, 7. Basic technical comfort helps for 3 and 4.

**Is this financial advice?** No. Earnings vary by skill, market, and effort. MMHow publishes educational guides only.
EOF

# Article 2 body
read -r -d '' BODY2 <<'EOF' || true
## Overview

When you run content, marketing, or a micro-business solo, outsourcing can push **monthly burn to $800–1,500** before you see reliable revenue.

This guide walks through a **compliant, practical swap**: keep quality, cut recurring vendor cost, and use AI as an **efficiency layer**.

## The Real Math (Illustrative)

| Line item | Outsourced | AI-assisted solo |
|-----------|------------|------------------|
| Copy / posts | $350–500/mo | ~$20 tools |
| Basic design | $300–450/mo | Canva Pro ~$13/mo |
| VA / scheduling | $250–400/mo | Automations + your time |
| **Total** | **~$900–1,350/mo** | **~$45–80/mo tools** |

You trade **cash** for **time**. The win is sustainable only if the hours you spend are worth it.

## What AI Can Replace (and What It Cannot)

**Good fits:** first drafts, repurposing content, template graphics, meeting notes, FAQ replies (with review).

**Poor fits:** brand strategy, high-stakes sales, nuanced relationships, legal or tax decisions.

## A 4-Step Replacement Workflow

1. **Audit** outsourced tasks (tag A/B/C by automation potential)
2. **Build one SOP** per repeatable task with saved prompts
3. **Swap tools, not standards** — Canva + Claude, export without AI badges
4. **Measure monthly** effective hourly rate vs what you used to pay vendors

## Mistakes to Avoid

- Replacing vendors before you have a process
- Publishing raw AI copy
- Ignoring tool + API costs
- Expecting zero learning curve (budget 2–4 weeks)

## FAQ

**How much can I save?** Many solo operators report **$500–1,200/month** after 30–60 days if tasks were clear enough to automate.
EOF

SVG1="data:image/svg+xml;base64,$(svg_b64 ai-side-hustle-paths.svg)"
SVG2="data:image/svg+xml;base64,$(svg_b64 ai-multiplier-framework.svg)"
SVG3="data:image/svg+xml;base64,$(svg_b64 ai-outsourcing-savings.svg)"

python3 <<PY
import json, os

body1 = os.environ.get("BODY1", "")
body2 = os.environ.get("BODY2", "")

articles = [
  {
    "title": "7 AI Side Hustle Paths That Can Add \$1,000/Day (Realistically)",
    "slug": "seven-ai-side-hustle-paths",
    "category": "ai-powered-side-hustles",
    "status": "draft",
    "descriptionFormat": "markdown",
    "featuredImage": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    "description": """$BODY1""",
    "images": [
      {"url": """$SVG1""", "alt": "Seven AI side hustle paths decision chart", "caption": "Figure 1: Seven proven paths."},
      {"url": """$SVG2""", "alt": "Skill times AI tools equals paid delivery", "caption": "Figure 2: AI multiplies a skill."},
      {"url": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80", "alt": "Developer laptop workspace"}
    ]
  },
  {
    "title": "How I Replaced \$1,000/Month in Outsourcing with AI Tools",
    "slug": "replace-outsourcing-with-ai-tools",
    "category": "ai-powered-side-hustles",
    "status": "draft",
    "descriptionFormat": "markdown",
    "featuredImage": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80",
    "description": """$BODY2""",
    "images": [
      {"url": """$SVG3""", "alt": "Outsourcing vs AI-assisted cost comparison", "caption": "Figure 1: Illustrative monthly costs."},
      {"url": """$SVG2""", "alt": "Skill multiplied by AI tools framework", "caption": "Figure 2: AI is the multiplier."},
      {"url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80", "alt": "Analytics dashboard"}
    ]
  }
]

for i, a in enumerate(articles, 1):
    with open(f"/tmp/mmhow-article-{i}.json", "w") as f:
        json.dump(a, f)
PY

echo "=== Article 1 ==="
publish_json /tmp/mmhow-article-1.json
echo
echo "=== Article 2 ==="
publish_json /tmp/mmhow-article-2.json
echo
