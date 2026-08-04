# Project Guidelines

## Purpose
This repository is the marketing and documentation workspace for the Telegram shop platform.
Use it for landing pages, product marketing copy, documentation structure, and GitHub Pages publishing.

## Source Of Truth
Do not invent platform capabilities.

**Start here:** `docs/_internal/platform-facts.md` in this repo. It is the
distilled, verified list of every command, tab, field, status and payment
method, taken directly from the product code. It is excluded from the built
site. Keep it updated whenever the product UI changes.

**Do not read `insomnia.workshop/docs/owner-guide.md`.** That copy is
deprecated and out of date. The canonical owner guide lives in this repo at
`docs/owner-guide.md`.

For deeper product context, inspect the sibling workspace root
`insomnia.workshop`:
- `insomnia.workshop/docs/PROJECT_CONTEXT_FOR_AGENTS.md`
- `insomnia.workshop/README.md`

When claims depend on implementation details, verify them in code:

| What | Where |
|---|---|
| Bot commands | `insomnia.workshop/backend/app/bot/handlers.py` |
| Bot admin menu | `insomnia.workshop/backend/app/bot/admin_ui.py` |
| Bot reply keyboard | `insomnia.workshop/backend/app/bot/keyboards.py` |
| In-bot `/guide` content | `insomnia.workshop/backend/app/bot/guide_ui.py` |
| WebApp shell tabs | `insomnia.workshop/backend/app/api/shop_webapp.py` (`_build_shop_sections`) |
| Admin hub tabs and settings | `insomnia.workshop/backend/webapp/admin_products/main.js` (`HUB_TABS`) |
| Order statuses, payment methods | `insomnia.workshop/backend/app/domain/order_status.py` |
| Feature gating by plan | `insomnia.workshop/backend/app/application/feature_registry.py` |

## Landing Page Rules
The landing page should sell a real product, not a generic SaaS template.
Write for store owners who sell through Telegram and want a simpler operating system for catalog, orders, payments, delivery, and growth.

Prefer these angles:
- Telegram-first commerce
- fast store launch
- owner control without custom development
- WebApp admin hub for daily operations
- payments, Nova Poshta, analytics, campaigns, and customer management

Avoid these mistakes:
- promising features that are not implemented
- calling the product website-first
- describing it as "just a bot"
- vague AI-style marketing filler
- claiming the WebApp has eight top-level tabs — it has three
  (`Каталог`, `Замовлення`, `Керування`); the eight live inside `Керування`

## Documentation Rules
See `CLAUDE.md` in the repo root for the full documentation writing contract:
audience, tone, how UI labels are quoted, and how screenshot placeholders work.

## Workflow
For landing work, first gather context from both repos, then summarize:
- target audience
- product promise
- differentiators
- verified feature set
- proof points from real UI flows

Only after that should you propose structure or write code.

## Content Style
Use concise Ukrainian copy by default unless the task explicitly asks for another language.
Keep tone product-focused, direct, and commercial.
Prefer specific outcomes over abstract benefits.

## Publishing
This repo is the MkDocs source repo.
`main` should contain `mkdocs.yml` and `docs/`.
`gh-pages` is publish output only.
Do not edit landing/source files on `gh-pages`.

Local build:

```bash
pip install mkdocs-material
mkdocs serve
mkdocs build --strict
```

Requires `mkdocs-material` 9.4 or newer (the config uses
`material.extensions.emoji`).
