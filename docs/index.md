---
icon: ph/house
hide:
  - navigation
  - toc
  - footer
---

<section class="c-hero" markdown>

<div class="c-hero-copy" markdown>

<p class="c-eyebrow" markdown="span">:ph-book-open-text: Документація Cartium</p>

# Ваш магазин у Telegram

<p class="lede">Усе, що потрібно знати власнику, щоб запустити магазин і спокійно ним керувати. Без коду, без технічних деталей — тільки те, що ви робите пальцем у телефоні.</p>

<div class="c-hero-actions" markdown>

[Швидкий старт :ph-arrow-right:](owner-guide.md#швидкий-старт){ .c-btn .c-btn-primary }
[Повна інструкція](owner-guide.md){ .c-btn .c-btn-ghost }

</div>

<p class="c-hero-note" markdown="span">:ph-seal-check: Усі знімки екрана — з мобільної версії, як у вас у Telegram</p>

</div>

<div class="c-hero-stage" markdown>
<div class="c-hero-tilt" markdown>

![Список замовлень](assets/shots/orders-list.png){ .phone }
![Аналітика магазину](assets/shots/analytics.png){ .phone }
![Вітрина магазину в Telegram](assets/shots/shell-catalog.png){ .phone }

</div>
</div>

</section>

<div class="c-section-head" markdown>

## З чого почати

<p>Оберіть задачу — кожна картка веде на окремий розділ з покроковою інструкцією.</p>

</div>

<div class="cards" markdown>

<div class="card" markdown>
### :ph-rocket-launch: Перший запуск
Створіть магазин у Telegram за кілька хвилин і дійдіть до першого продажу. Почніть звідси.

[Швидкий старт :ph-arrow-right:](owner-guide.md#швидкий-старт){ .card-link }
</div>

<div class="card" markdown>
### :ph-book-open-text: Повна інструкція
Детальний гайд по всіх розділах: каталог, замовлення, вигляд, підписка, модулі росту.

[Інструкція для власника :ph-arrow-right:](owner-guide.md){ .card-link }
</div>

<div class="card" markdown>
### :ph-credit-card: Оплати
LiqPay, Monobank, оплата за реквізитами та післяплата — як підключити, перевірити тестовим платежем і перейти на бойові ключі.

[Налаштувати оплати :ph-arrow-right:](payments.md){ .card-link }
</div>

<div class="card" markdown>
### :ph-truck: Доставка
Нова пошта: API ключ (і його термін дії), дані відправника і створення ТТН прямо із замовлення.

[Налаштувати доставку :ph-arrow-right:](nova-poshta.md){ .card-link }
</div>

<div class="card" markdown>
### :ph-file-arrow-up: Імпорт каталогу
Завантажте всі товари одним файлом CSV або XLSX: з перевіркою перед додаванням і скасуванням.

[Як імпортувати :ph-arrow-right:](import.md){ .card-link }
</div>

<div class="card" markdown>
### :ph-clipboard-text: Чекліст запуску
Коротка перевірка перед тим, як пускати реальних покупців.

[Відкрити чекліст :ph-arrow-right:](launch.md){ .card-link }
</div>

<div class="card" markdown>
### :ph-lifebuoy: Щось не працює
Немає доступу, замовлення зависло, ТТН не створюється, імпорт пропустив рядки, зникла вкладка.

[Часті ситуації :ph-arrow-right:](owner-guide.md#часті-ситуації){ .card-link }
</div>

</div>

---

## Як усе влаштовано

Ваш магазин живе у Telegram і має два інтерфейси. Це не два різні продукти — це один магазин, до якого можна дістатися двома шляхами.

<div class="split" markdown>

<div class="split-item" markdown>
#### :ph-robot: Telegram-бот

Швидкі дії на ходу. Подивитися нові замовлення, підтвердити оплату, додати товар, створити ТТН.

Відкривається командою `/admin`.
</div>

<div class="split-item" markdown>
#### :ph-layout: WebApp магазину

Повноцінний робочий кабінет. Каталог, замовлення, клієнти, аналітика, промокоди, зовнішній вигляд, підписка.

Відкривається кнопкою з бота.
</div>

</div>

!!! tip "Просте правило"
    Одну дію швидко — робіть у боті. Сідаєте працювати з магазином — відкривайте WebApp.

---

## Як це виглядає

Усе, що описано в гайді, ви робите з телефона — прямо в Telegram. Знімки екрана в інструкції теж із мобільної версії.

<div class="c-stage" markdown>

<div class="phones" markdown>

![Вітрина магазину](assets/shots/shell-catalog.png){ .phone }
![Керування товарами](assets/shots/hub-products.png){ .phone }
![Замовлення](assets/shots/orders-list.png){ .phone }
![Способи оплати](assets/shots/payments-list.png){ .phone }

</div>

</div>

---

## Скільки часу займе налаштування

| Що робите | Приблизно |
|---|---|
| Створити магазин через бота і зайти в адмінку | 5 хвилин |
| Створити категорії та додати перші товари | 10–15 хвилин |
| Підключити оплату | 5 хвилин, якщо ключі вже на руках |
| Підключити Нову пошту | 5 хвилин |
| Пройти тестове замовлення | 5 хвилин |

Онлайн-еквайринг (LiqPay або Monobank) підключається на стороні банку і може зайняти кілька днів. Почніть з цього, а решту налаштовуйте паралельно. Поки чекаєте — приймайте оплату за реквізитами чи післяплатою.
