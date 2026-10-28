# tgshop-docs — правила роботи з документацією

Це репозиторій публічної документації Telegram-платформи магазинів
(продукт: `insomnia.workshop`). Сайт збирається MkDocs Material і
публікується на https://docs.cartium.store/ (GitHub Pages, домен задає файл `docs/CNAME`)

## Канонічність

**Цей репозиторій — єдине канонічне джерело публічних сторінок документації.**

У продуктовому репозиторії `insomnia.workshop/docs/` раніше лежала друга
копія `owner-guide.md`. Вона застаріла і більше не редагується. Якщо треба
змінити гайд — змінюйте його тут.

## Аудиторія

Діючі клієнти платформи — власники магазинів, які вже купили доступ і
налаштовують магазин самостійно. Це не розробники.

Наслідки для тексту:
- ніякого коду, назв файлів, ендпоінтів, змінних оточення;
- жодних згадок «бекенд», «API-роут», «тенант», «фіче-флаг»;
- кожен крок — дія, яку людина може зробити пальцем у Telegram;
- мова: українська, звертання на «ви».

## Головне правило точності

**Назви кнопок, вкладок, полів і статусів цитуються дослівно з інтерфейсу.**

Якщо ви не бачите назву в коді продукту — не вигадуйте її. Джерело правди:
`docs/_internal/platform-facts.md` (не публікується, виключений у `mkdocs.yml`).

Якщо є доступ до репозиторію продукту, перевіряйте назви тут:

| Що | Де в коді продукту |
|---|---|
| Команди бота | `backend/app/bot/handlers.py` (реєстрація `CommandHandler`) |
| Адмін-меню бота | `backend/app/bot/admin_ui.py` |
| Reply-клавіатура бота | `backend/app/bot/keyboards.py` |
| Вкладки оболонки WebApp | `backend/app/api/shop_webapp.py` → `_build_shop_sections` |
| Вкладки розділу «Керування» | `backend/webapp/admin_products/main.js` → `HUB_TABS` |
| Секції «Налаштування» | `backend/webapp/admin_products/main.js` (список `subscription`…`content`) |
| Статуси замовлень | `backend/app/domain/order_status.py` → `STATUS_DISPLAY_NAMES` |
| Способи оплати | `backend/app/domain/order_status.py` → `PaymentMethod` |
| Режими доступу магазину | `backend/webapp/admin_products/index.html` (select access mode) |

Після будь-якої правки фактів оновіть `docs/_internal/platform-facts.md`.

## Оформлення

- MkDocs Material, увімкнені: `admonition`, `pymdownx.details`,
  `pymdownx.tabbed`, `attr_list`, `md_in_html`, `tables`, `toc`.
- Назви елементів інтерфейсу — інлайн-кодом: `` `⚙️ Налаштування` ``.
- Довгі списки «що робити, якщо не працює» — у `??? question "…"`
  (згорнутий блок), щоб не роздувати сторінку.
- Картки-посилання на головній — `<div class="cards" markdown>` (стилі в
  `docs/styles/extra.css`).

### Дизайн (одна родина з cartium.store)

Вигляд повторює сайт `cartium-website` (`src/styles/global.css`): шрифт Fixel
(лежить у `docs/assets/fonts/`, Google Fonts не використовуються), палітра
«soft graphite» (світла `#f4f4f5` / темна `#111113`), кнопки-«пігулки»,
картки з радіусом 28px. Якщо на сайті змінюються токени — переносьте їх у
`:root` на початку `extra.css`.

- Шапка й підвал — `overrides/partials/header.html` і `footer.html`;
  посилання в них задаються в `extra:` у `mkdocs.yml`.
- Анімації, мобільна кнопка «Зміст», час читання — `docs/javascripts/cartium.js`.
- Іконки — Phosphor, як на сайті: `:ph-rocket-launch:` у тексті,
  `icon: ph/…` у front matter сторінки (іконка в меню). Файли — `overrides/.icons/ph/`;
  нову іконку беріть з пакета `@phosphor-icons/core` (regular).
- Головна: герой `<section class="c-hero" markdown>`, графітова сцена зі
  знімками `<div class="c-stage" markdown>`, заголовок секції
  `<div class="c-section-head" markdown>`.

## Скріншоти

Знімки Mini App — **мобільні** (більшість власників працює з телефона) і **генеруються**, а не робляться руками: див. `docs/assets/shots/README.md` (сценарій `docshots` у репозиторії продукту + скрипт експорту). Вставляйте їх так:

```markdown
![Опис знімка](assets/shots/імʼя.png){ .phone }
```

Для «текст зліва, знімок справа» — `<div class="with-shot" markdown>` (див. `owner-guide.md`); для двох знімків поруч — `<div class="phones" markdown>`.

Знімки зовнішніх сервісів (кабінети Нової пошти, банків) і самого Telegram генерувати не можна — вони ручні й перелічені в README.

## Збірка

```bash
pip install mkdocs-material
mkdocs serve      # локальний перегляд
mkdocs build      # перевірка, що нічого не зламано
```

Перед комітом прогоніть `mkdocs build --strict` — він упаде на битих
внутрішніх посиланнях.
