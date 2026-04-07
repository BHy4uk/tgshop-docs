---
description: "Build or redesign the SPA landing page for the Telegram shop platform using verified product context from the sibling insomnia.workshop repo"
name: "Build SPA Landing"
argument-hint: "Describe the landing goal, audience, and visual direction"
agent: "agent"
---
Build or redesign the SPA landing page for the Telegram shop platform.

Before writing any code:
1. Read the project instructions for this repo.
2. Inspect the sibling workspace root `insomnia.workshop` to verify the real platform functionality.
3. Read at minimum:
   - [owner guide](../../insomnia.workshop/docs/owner-guide.md)
   - [project context](../../insomnia.workshop/docs/PROJECT_CONTEXT_FOR_AGENTS.md)
   - [main README](../../insomnia.workshop/README.md)
4. When needed, verify implementation details in:
   - `insomnia.workshop/backend/app/application/feature_registry.py`
   - `insomnia.workshop/backend/webapp/admin_products/main.js`
   - `insomnia.workshop/backend/app/bot/admin_ui.py`

Then produce a concise planning summary with:
- target audience
- core product promise
- verified features worth highlighting
- things that should not be claimed on the landing page

After that, implement the landing page.

Requirements for the landing page:
- It must be a strong commercial SPA landing page, not documentation.
- It must feel intentional and premium, not like a generic SaaS template.
- It must work well on desktop and mobile.
- It must explain the platform in plain language for store owners.
- It must highlight verified capabilities such as Telegram sales flow, catalog management, orders, payments, Nova Poshta, WebApp admin, analytics, campaigns, and customer tools when supported by the product.
- It must include a clear CTA strategy.

Implementation rules:
- Keep source files in `main` only.
- Do not edit `gh-pages` as a source branch.
- If product messaging is unclear, prefer what is verified in `insomnia.workshop` over assumptions.

If the user provides extra direction, treat it as a creative brief layered on top of the verified product context.