# Скріншоти для документації

Цей файл не публікується на сайті.

## Мобільна версія — основна

Більшість власників керують магазином з телефона, тому **усі знімки Mini App — мобільні** (390×844, ×2), а не з веб-версії.

Знімки Mini App не робляться руками: їх генерує сценарій у репозиторії продукту (`insomnia.workshop`) на тестових даних, тож у них немає реальних клієнтів, телефонів чи ключів.

```bash
# з кореня insomnia.workshop
node tools/webapp-harness/run.mjs docshots
python tools/webapp-harness/docshots_export.py <шлях до tgshop-docs>/docs/assets/shots
```

Сценарій: `tools/webapp-harness/suites/docshots.mjs` (один сценарій = один файл; назва сценарію = назва PNG). Скрипт експорту обрізає порожню смугу зверху, округлює кути й оптимізує PNG. Після зміни інтерфейсу продукту запустіть обидві команди й перегляньте результат.

## Які файли є

| Файл | Що на ньому | Сторінка |
|---|---|---|
| `shell-catalog` | Вітрина з нижньою панеллю | owner-guide, index |
| `hub-products`, `hub-more-menu` | Розділ «Керування» і меню «Ще» | owner-guide |
| `product-create`, `product-create-variants` | Форма товару | owner-guide |
| `import-empty`, `import-preview`, `import-result` | Імпорт каталогу | import, owner-guide |
| `orders-list`, `order-details`, `order-actions`, `order-ttn` | Замовлення і дії з ТТН | owner-guide, nova-poshta, launch |
| `settings-subscription`, `settings-access-mode`, `settings-modules` | Підписка, режими доступу, модулі | owner-guide |
| `payments-list`, `payments-liqpay`, `payments-mono`, `payments-link`, `payments-details` | Способи оплати | payments |
| `settings-delivery` | Нова пошта | nova-poshta, owner-guide |
| `appearance` | Редактор вигляду | owner-guide |
| `promos`, `campaigns`, `analytics`, `customers` | Модулі зростання | owner-guide |

## Те, що генерувати не можна

Ці знімки зроблені вручну з реальних сервісів і не оновлюються автоматично — перевіряйте їх при кожній зміні відповідних кабінетів:

| Файл | Що на ньому |
|---|---|
| `admin-menu.png` | Адмін-меню бота після `/admin` (Telegram) |
| `np-api-key.png` | Створення API ключа в кабінеті Нової пошти (зовнішній сайт) |

## Вимоги до знімків

- Mini App — мобільні, світла тема, генеруються сценарієм вище.
- Ніяких реальних даних: номерів телефонів, ПІБ клієнтів, токенів, API ключів.
- Ручні знімки — PNG, обрізати зайве; на сайті вони відображаються з рамкою (клас `.phone`) або на всю ширину тексту.
