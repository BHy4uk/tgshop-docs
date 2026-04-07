# Архітектура Multi-Tenant Platform

## Поточний стан (MVP)
```
1 платформа = N ботів = 1 deploy = конфіг в БД
```

## Цільова архітектура (Scale)
```
1 платформа = N ботів = 1 deploy = конфіг в БД
```

---

## Схема бази даних для масштабування

### Collection: `tenants`
```javascript
{
  "_id": ObjectId,
  "id": "shop_clothing",           // Унікальний slug
  "name": "Магазин модного одягу",
  "bot_token": "111111:AAA...",    // Telegram Bot Token
  "bot_username": "ClothingShopBot",
  
  // Власник та адміни
  "owner_id": 123456789,           // Telegram ID власника
  "admin_ids": [123456789, 987654321],
  
  // Платіжні налаштування
  "payment": {
    "link": {
      "enabled": true,
      "url": "https://send.monobank.ua/jar/XXX"
    },
    "details": {
      "enabled": false,
      "text": "..."
    },
    "cod": {
      "enabled": false
    },
    "monobank_webhook_secret": "secret_xxx"
  },
  
  // Підписка
  "subscription": {
    "plan_id": "pro",
    "status": "active",            // active | grace | frozen
    "paid_until": "2026-03-01"
  },
  
  // Ліміти
  "limits": {
    "max_products": 100,
    "max_admins": 5
  },
  
  "status": "active",              // active | suspended | deleted
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### Collection: `platform_config`
```javascript
{
  "platform_admin_ids": [392160708, 322482780],
  "default_plan": "starter",
  "webhook_base_url": "https://platform.example.com"
}
```

---

## Процес онбордингу нового магазину

### Крок 1: Власник створює бота
1. Відкриває @BotFather в Telegram
2. `/newbot` → вводить назву → отримує токен
3. Надсилає токен платформному адміну

### Крок 2: Platform Admin реєструє магазин
```
/platform_add
```
Бот запитує:
- Tenant ID (slug): `fashion_store`
- Bot Token: `123456:ABC...`
- Owner Telegram ID: `987654321`
- Payment link (Monobank jar/pay тощо): `https://send.monobank.ua/jar/...`
- Payment requisites (IBAN/ПІБ тощо): текстом у налаштуваннях
- Накладений платіж: вмикається як окремий метод оплати

### Крок 3: Система автоматично
1. Валідує bot token (getMe)
2. Створює запис в `tenants`
3. Створює `tenant_settings` з дефолтами
4. Створює `subscriptions` з trial періодом
5. Запускає polling для нового бота

### Крок 4: Власник налаштовує магазин
- Заходить у свого бота
- `/admin` → додає товари, адмінів, тексти

---

## .env для Multi-Tenant Platform

```bash
# ===== PLATFORM CONFIG (не змінюється при додаванні магазинів) =====

# MongoDB - одна база для всіх магазинів
MONGO_URL=mongodb://mongodb:27017/telegram_shop_platform
DB_NAME=telegram_shop_platform

# Platform Admins - можуть керувати всіма магазинами
PLATFORM_ADMIN_IDS=392160708,322482780

# Environment
ENVIRONMENT=production
LOG_LEVEL=INFO

# Webhook base URL (для Monobank callbacks)
WEBHOOK_BASE_URL=https://shop-platform.example.com

# ===== НЕ ПОТРІБНО (зберігається в БД) =====
# BOT_TOKEN - кожен магазин має свій в БД
# TENANT_ID - визначається динамічно
# ADMIN_IDS - зберігаються в tenant_settings
# MONOBANK_BASE_URL - зберігається в tenants
```

---

## Порівняння підходів

| Критерій | 1 бот = 1 deploy | Multi-bot platform |
|----------|------------------|-------------------|
| Магазинів | 1-10 | 10-1000+ |
| Контейнерів | N | 1-3 |
| .env файлів | N | 1 |
| Додати магазин | Deploy новий контейнер | Команда в боті |
| Час онбордингу | 30-60 хв | 2-5 хв |
| Вартість хостингу | Висока (N × $5-20) | Низька ($20-50 total) |
| Складність коду | Проста | Середня |
| Ізоляція даних | Повна | Логічна (tenant_id) |

---

## План міграції

### Фаза 1: Підготовка (поточний стан ✅)
- [x] Multi-tenant data model (tenant_id в кожній колекції)
- [x] Tenant settings в БД
- [x] Admin management через UI

### Фаза 2: Multi-Bot Runner (поточний стан ✅)
- [x] Bot Registry (in-memory) + керування ботами
- [x] Dynamic bot polling (запуск/зупинка ботів)
- [x] Platform Admin команди: `/platform_add`, `/platform_list`, `/platform_suspend`, `/platform_activate`, `/platform_restart_bot`
- [ ] Webhook routing по tenant_id (частково/залежить від провайдера)

### Фаза 3: Self-Service Portal (опціонально)
- [ ] Web UI для реєстрації магазинів
- [ ] Stripe інтеграція для оплати підписок
- [ ] Dashboard для власників магазинів

---

## Приклад: 3 магазини в БД

```javascript
// tenants collection
[
  {
    "id": "fashion_kyiv",
    "name": "Мода Київ",
    "bot_token": "111:AAA",
    "bot_username": "FashionKyivBot",
    "owner_id": 100000001,
    "admin_ids": [100000001, 100000002],
    "payment": {
      "link": {"enabled": true, "url": "https://send.monobank.ua/jar/ABC"},
      "details": {"enabled": false, "text": ""},
      "cod": {"enabled": false}
    },
    "subscription": { "status": "active", "paid_until": "2026-06-01" }
  },
  {
    "id": "tech_store",
    "name": "ТехноМаркет",
    "bot_token": "222:BBB",
    "bot_username": "TechStoreUaBot",
    "owner_id": 200000001,
    "admin_ids": [200000001],
    "payment": {
      "link": {"enabled": true, "url": "https://send.monobank.ua/jar/DEF"},
      "details": {"enabled": false, "text": ""},
      "cod": {"enabled": false}
    },
    "subscription": { "status": "active", "paid_until": "2026-04-15" }
  },
  {
    "id": "handmade_crafts",
    "name": "Хендмейд",
    "bot_token": "333:CCC",
    "bot_username": "HandmadeCraftsBot",
    "owner_id": 300000001,
    "admin_ids": [300000001, 300000002, 300000003],
    "payment": {
      "link": {"enabled": true, "url": "https://send.monobank.ua/jar/GHI"},
      "details": {"enabled": false, "text": ""},
      "cod": {"enabled": false}
    },
    "subscription": { "status": "grace", "paid_until": "2026-01-20" }
  }
]
```

---

## Команди Platform Admin

```
/platform - головне меню платформи
/platform_add - додати новий магазин
/platform_list - список всіх магазинів
/platform_tenant {id} - деталі магазину
/platform_suspend {id} - призупинити магазин
/platform_activate {id} - активувати магазин
# /platform_delete {id} - видалити магазин (ще не реалізовано)
```

---

## Наступні кроки

1. **Якщо магазинів < 10:** Залишайтесь на поточній архітектурі (1 bot = 1 deploy)
2. **Якщо плануєте 10+:** Потрібна розробка Multi-Bot Runner (~2-3 дні роботи)
3. **Якщо плануєте 50+:** Додатково потрібен Web Portal для self-service

Хочете, щоб я розробив Multi-Bot Runner для масштабування?
