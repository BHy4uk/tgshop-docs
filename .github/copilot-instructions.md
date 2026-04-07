# Project Guidelines

## Purpose
This repository is the marketing and documentation workspace for the Telegram shop platform.
Use it for landing pages, product marketing copy, documentation structure, and GitHub Pages publishing.

## Source Of Truth
Do not invent platform capabilities.
Before writing landing pages or product copy, inspect the sibling workspace root `insomnia.workshop` for real functionality.

Read these files first when working on messaging or product positioning:
- `insomnia.workshop/docs/owner-guide.md`
- `insomnia.workshop/docs/PROJECT_CONTEXT_FOR_AGENTS.md`
- `insomnia.workshop/README.md`

When claims depend on implementation details, verify them in code. Priority files:
- `insomnia.workshop/backend/app/application/feature_registry.py`
- `insomnia.workshop/backend/webapp/admin_products/main.js`
- `insomnia.workshop/backend/app/bot/admin_ui.py`
- `insomnia.workshop/backend/app/bot/guide_ui.py`

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