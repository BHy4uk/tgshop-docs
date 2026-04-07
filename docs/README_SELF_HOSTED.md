# Telegram Shop Bot (FastAPI + MongoDB) — Self-hosted (Windows + Docker Compose)

Це Telegram-магазин бот з каталогом, кошиком, збором даних доставки (Нова Пошта) та ручним підтвердженням оплати.

> Оплата: підтримуються 3 способи — **за посиланням**, **за реквізитами**, **накладений платіж**.
> Підтвердження оплати: вручну адміном (для оплат за посиланням/реквізитами).

**Корисні документи:**
- Для власника магазину (як керувати через Telegram): **CLIENT_HANDOFF.md**
- Комерційний наратив/підписка (Manual MVP): **PRICING_NARRATIVE.md**

---

## 0) Що саме запускаємо
У цьому репозиторії **backend** (FastAPI) при старті:
- підключається до MongoDB
- створює індекси
- сідує демо-товари (якщо БД порожня)
- створює `tenant_settings` (для керування текстами/кнопками)
- **автоматично завантажує всі активні магазини з БД** та запускає їх ботів

Тобто вам достатньо підняти **2 контейнери**:
- `mongodb`
- `bot` (FastAPI + Telegram polling для всіх магазинів)

---

## 1) Передумови (Windows)

### 1.1 Встановити Docker Desktop
1) Встановіть **Docker Desktop for Windows**: https://www.docker.com/products/docker-desktop/
2) Під час інсталяції увімкніть **WSL 2** (якщо попросить).
3) Після інсталяції перезавантажте ПК (якщо Docker попросить).
4) Переконайтесь, що Docker запущений: відкрийте Docker Desktop → статус “Running”.

### 1.2 Встановити Git (для клонування репозиторію)
- https://git-scm.com/download/win

> Команди нижче можна виконувати в **PowerShell** або **Git Bash**.

---

## 2) Клон репозиторію
```powershell
git clone <YOUR_GITHUB_REPO_URL>
cd <repo>
```

---

## 3) Налаштування середовища (.env)

### 3.1 Створити `backend/.env`
У корені репо:
```powershell
copy backend\.env.example backend\.env
```

Відкрийте `backend/.env` у будь-якому редакторі (VS Code / Notepad++).

### 3.2 Які змінні обовʼязкові

```env
MONGO_URL=mongodb://mongodb:27017
DB_NAME=telegram_shop
TENANT_ID=my_shop
ENVIRONMENT=production
PLATFORM_ADMIN_IDS=123456789
ADMIN_IDS=123456789
BOT_TOKEN=123456:ABC-your-token
MONOBANK_BASE_URL=https://send.monobank.ua/jar/YOUR_JAR
ACCESS_MODE_OVERRIDE=
```

### 3.3 Як дізнатись свій Telegram ID
1) Запустіть бота (крок 4)
2) Дізнайтесь свій Telegram ID (наприклад, через @userinfobot)
3) Скопіюйте ID у `ADMIN_IDS` та `PLATFORM_ADMIN_IDS`

---

## 4) Запуск через Docker Compose

### 4.1 Підняти сервіси
```powershell
docker compose up -d --build
```

### 4.2 Перевірка логів
```powershell
docker compose logs -f bot
```

Очікуйте в логах:
```
Connected to MongoDB
Multi-tenant mode: Loading bots from database...
Started 1 tenant bots from database
Bot for tenant my_shop polling started
```

### 4.3 Перевірка health endpoint
```powershell
curl http://localhost:8001/api/health
```
Очікувана відповідь: `{"status":"ok"}`

---

## 5) Додавання нових магазинів (Multi-tenant)

### Через Telegram (рекомендовано):
1) Напишіть боту `/platform_add`
2) Слідуйте інструкціям (введіть tenant_id, назву, токен нового бота, owner_id)
3) Бот автоматично запуститься!

### Команди Platform Admin:
- `/platform_list` — список всіх магазинів
- `/platform_add` — додати новий магазин
- `/platform_tenant {id}` — деталі магазину
- `/platform_suspend {id}` — призупинити
- `/platform_activate {id}` — активувати
- `/cancel` — скасувати поточну операцію

---

## 6) Робота з базою даних (MongoDB) — базові інструкції

### 5.1 Підключитись до Mongo через контейнер (найпростіше)
Відкрити Mongo shell прямо всередині контейнера:
```powershell
docker exec -it telegram_shop_mongodb mongosh
```

Далі в `mongosh`:
```js
show dbs
use telegram_shop
show collections

// Подивитися налаштування тенанта
db.tenant_settings.find().pretty()

// Подивитися продукти
db.products.find().limit(5).pretty()

// Подивитися ордери
db.orders.find().sort({created_at:-1}).limit(5).pretty()
```

### 5.2 Підключитись через MongoDB Compass (GUI)
Якщо зручніше візуально:
- Встановіть MongoDB Compass: https://www.mongodb.com/try/download/compass
- Connection string (з Windows до контейнера):
  - `mongodb://localhost:27017`
- Далі виберіть базу `telegram_shop`.

> Примітка: у docker-compose в нас відкритий порт `27017:27017`, тому Compass підʼєднається без додаткових налаштувань.

### 5.3 Як зробити “чистий старт” (очистити базу)
**Варіант A (рекомендовано для чистих тестів, видаляє всі дані):**
```powershell
docker compose down -v
```
Потім знову:
```powershell
docker compose up -d --build
```
Це видалить volume `mongo_data` і створить нову порожню БД, після чого бекенд знову засідує демо-товари.

**Варіант B (обережніше — видалити тільки дані в конкретній БД):**
1) Зайдіть в `mongosh` (див. 5.1)
2) Виконайте:

## 7) Platform admin (підписки — Manual MVP)
Ці команди доступні **тільки** для `PLATFORM_ADMIN_IDS`:
- `/platform` або `/sub_status` — показати status/paid_until/plan поточного tenant
- `/sub_set_status active|grace|frozen`
- `/sub_set_paid_until 2026-02-01T00:00:00+00:00`


```js
use telegram_shop
db.dropDatabase()
```
3) Перезапустіть bot контейнер:
```powershell
docker compose restart bot
```

---

## 8) Команди бота (MVP)

> Підказки slash-команд у Telegram автоматично налаштовуються за ролями (клієнт / адмін магазину / platform-admin).

### 8.1 Для клієнта
- `/start` (коротке привітання + базові команди)
- `/catalog` (каталог)
- `/cart` (кошик)

### 8.2 Для адміна
- `/admin` (UI)
- `/guide` (інструкція для власника/адмінів)
- `/orders` (швидкий доступ до останніх замовлень)

## 8.3 Як онбордимо нового клієнта (довідка)
> Це довідка для платформи/технічної команди. Власник магазину працює через Telegram.

- Власнику: використовуйте <code>/guide</code> для інструкції в боті.

---

## 9) Оновлення коду
```powershell
git pull

docker compose up -d --build
```

---

## 10) Типові проблеми (Troubleshooting)

### 10.1 Telegram 409 Conflict (найчастіше)
**Симптом:** у логах `Conflict: terminated by other getUpdates request`.

**Причина:** Telegram дозволяє **тільки один** long-polling інстанс на один `BOT_TOKEN`.

**Що робити:**
- Переконайтесь, що ви не запустили цього бота десь ще (на VPS / у другому Docker / локально).
- Зупиніть зайвий інстанс.

### 10.2 Бот стартує, але “нічого не відповідає”
Перевірте:

## 10.3 Subscription (Manual MVP)
На старті підписки керуються вручну platform-admin’ом (без платежів/Stripe).

### Статуси
- `active` — все працює
- `grace` — зарезервовано під майбутнє (в MVP можна трактувати як active)
- `frozen` — магазин для клієнтів недоступний

### Soft-freeze (paid_until минув)
- каталог/перегляд товарів: ✅
- checkout/створення замовлення: ❌

### Platform-команди (тільки PLATFORM_ADMIN_IDS)
- `/platform` або `/sub_status` — показати subscription поточного tenant
- `/sub_set_status active|grace|frozen` — змінити статус
- `/sub_set_paid_until 2026-02-01T00:00:00+00:00` — змінити paid_until (вводиться ISO, але в UI показується як DD.MM.YYYY)


- `BOT_TOKEN` правильний
- контейнер `bot` не падає (див. логи)
- у вас немає 409 conflict

### 10.4 Mongo не доступний
Перевірте, що контейнер Mongo працює:
```powershell
docker ps
```
Має бути `telegram_shop_mongodb` зі статусом “Up”.

---

## 11) Smoke test (повний сценарій)
1) В Telegram: `/start`

---

# Owner Guide (коротко): як керувати магазином через Telegram

> Детальна інструкція для власника магазину винесена в окремий файл: **CLIENT_HANDOFF.md**

Короткий чекліст:
- `/admin` → **Товари** — керування товарами/фото/розмірами/залишками
- `/admin` → **Замовлення** — перегляд та підтвердження оплати (✅ Підтвердити оплату / Mark Paid)
- `/admin` → **Налаштування** — тексти/кнопки/посилання на оплату

Smoke test (повний сценарій):
1) В Telegram: `/start`
2) `/catalog` → додайте товар у кошик
3) `/cart` → введіть дані доставки
4) Отримаєте `order_id` + кнопку “Оплатити”
5) Натисніть “Я оплатив(ла)”
6) Адмін підтверджує: `/admin` → Замовлення → вибрати → ✅ Підтвердити оплату

---

## 12) Мульти‑середовища (production / staging / demo)

### 12.1 Підготовка env файлів
Створіть окремі env для кожного середовища (на основі прикладів):

```powershell
copy backend\.env.production.example backend\.env.production
copy backend\.env.staging.example backend\.env.staging
copy backend\.env.demo.example backend\.env.demo
```

**Важливо:**
- для кожного середовища задайте **унікальний `DB_NAME`**
- для demo встановіть `ACCESS_MODE_OVERRIDE=soft_freeze` та залиште `ADMIN_IDS`/`PLATFORM_ADMIN_IDS` порожніми (safe‑by‑default)

### 12.2 Запуск усіх середовищ паралельно
```powershell
docker compose -f docker-compose.multi.yml up -d --build
```

Порти за замовчуванням:
- production: `http://localhost:8001`
- staging: `http://localhost:8002`
- demo: `http://localhost:8003`

## 13) Backup MongoDB (cron + mongodump)

### 13.1 Один env (docker-compose.yml)
```powershell
docker compose up -d --build
```

Backups пишуться у `/backups/{ENVIRONMENT}/{YYYYMMDD-HHMMSS}/`.

### 13.2 Керування розкладом
В `docker-compose.yml` або `docker-compose.multi.yml` змініть:

```
BACKUP_SCHEDULE: "0 3 * * *"
```

## 14) Де дивитись логи
- Логи бота/бекенду:
```powershell
docker compose logs -f bot
```
- Логи Mongo:
```powershell
docker compose logs -f mongodb
```
