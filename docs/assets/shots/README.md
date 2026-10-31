# Скріншоти для документації

Цей файл не публікується на сайті.

## Мобільна версія — основна

Більшість власників керують магазином з телефона, тому **усі знімки Mini App — мобільні**: 390×844 CSS-пікселів, щільність ×3 (файл 1170 px завширшки), WebP.

Знімки не робляться руками: їх генерує сценарій `docshots` у репозиторії продукту (`insomnia.workshop`) на тестових даних, тож у них немає реальних клієнтів, телефонів чи ключів. Товари на знімках — ті самі демо-фото, що й на cartium.store (футболка, джинси, шорти з великим знаком питання й кільце), а не намальовані силуети.

```bash
# 1. У репозиторії продукту тимчасово ввімкнути фото товарів і щільність ×3
cd insomnia.workshop
git apply <шлях до tgshop-docs>/tools/docshots-harness.patch

# 2. Згенерувати знімки (фото товарів беруться з cartium-website)
DSF=3 PRODUCT_PHOTOS=<шлях до cartium-website>/src/assets/products \
  node tools/webapp-harness/run.mjs docshots

# 3. Повернути продукт як було
git checkout -- tools/webapp-harness

# 4. Експортувати в документацію (обрізає смугу над оболонкою, зберігає WebP)
cd <шлях до tgshop-docs>
python tools/export_shots.py <шлях до insomnia.workshop>/tools/webapp-harness/out/docshots
```

Знімки експортуються **без округлених кутів і без статус-бару**: рамку iPhone (титанова смуга, Dynamic Island, статус-бар, індикатор «додому») домальовує сайт — хук `hooks/phone_frame.py` обгортає кожне `![…](…){ .phone }`. Якщо Chrome не стартує від root, передайте `CHROME_PATH` на обгортку з `--no-sandbox`.

Сценарій: `tools/webapp-harness/suites/docshots.mjs` (один сценарій = один файл; назва сценарію = назва файлу). Після зміни інтерфейсу продукту пройдіть кроки 1–4 і перегляньте результат.

## Які файли є

| Файл | Що на ньому | Сторінка |
|---|---|---|
| `shell-catalog` | Вітрина з нижньою панеллю | index, quick-start, owner-guide |
| `hub-products`, `hub-more-menu` | Розділ «Керування» і меню «Ще» | index, owner-guide |
| `categories` | Вікно «Категорії» (сценарій додано в `tools/docshots-harness.patch`) | quick-start, owner-guide |
| `product-create`, `product-create-variants` | Форма товару | quick-start, owner-guide |
| `import-empty`, `import-preview`, `import-result` | Імпорт каталогу | import |
| `orders-list`, `order-details`, `order-actions`, `order-ttn` | Замовлення і дії з ТТН | index, quick-start, owner-guide, nova-poshta, launch |
| `settings-subscription`, `settings-access-mode`, `settings-modules` | Підписка, режими доступу, модулі | owner-guide |
| `payments-list`, `payments-stripe`, `payments-paypal`, `payments-liqpay`, `payments-mono`, `payments-link`, `payments-details` | Способи оплати (сценарії Stripe і PayPal додано в `tools/docshots-harness.patch`) | index, quick-start, owner-guide, payments |
| `payments-currency` | Валюти магазину (сценарій у `tools/docshots-harness.patch`) | payments |
| `settings-delivery` | Екран `Підключення Нової пошти` | quick-start, nova-poshta |
| `delivery-list`, `delivery-service`, `delivery-countries` | Екран `Доставка`, екран служби й екран `Країни доставки` (сценарії в `tools/docshots-harness.patch`) | owner-guide |
| `appearance` | Редактор вигляду | quick-start, owner-guide |
| `promos`, `campaigns`, `analytics`, `customers` | Інструменти зростання | index, owner-guide |
| `settings-all`, `shell-orders` | Генеруються сценарієм, поки ніде не використані | — |

## Те, що генерувати не можна

Знімок зроблено вручну з реального сервісу, він не оновлюється автоматично — перевіряйте його при зміні кабінету:

| Файл | Що на ньому |
|---|---|
| `np-api-key.png` | Створення API ключа в кабінеті Нової пошти (зовнішній сайт) |

Знімків бота в Telegram у документації немає навмисно: основна робота описана через панель `Керування`, а бот — текстом на сторінці `bot.md`.

## Вимоги до знімків

- Mini App — мобільні, світла тема, генеруються сценарієм вище.
- Ніяких реальних даних: номерів телефонів, ПІБ клієнтів, токенів, API ключів.
- Ручні знімки — PNG без класу `.phone` (рамка iPhone для зовнішніх сайтів не потрібна).
