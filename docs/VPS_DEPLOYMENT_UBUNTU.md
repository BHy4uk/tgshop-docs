# Деплой на VPS (Ubuntu Server 22 LTS) — production / staging / demo + backup

Нижче — покрокова інструкція для «чистого» VPS з Docker.

---

## 1) Підключення до VPS
```bash
ssh ubuntu@<YOUR_VPS_IP>
```

---

## 2) Базові пакети
```bash
sudo apt-get update -y
sudo apt-get install -y git docker-compose-plugin
```

Перевірити:
```bash
docker --version
docker compose version
```

Додати користувача в групу docker (щоб без sudo):
```bash
sudo usermod -aG docker $USER
```
Після цього вийдіть і зайдіть знову по SSH.

---

## 3) Клон репозиторію
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <repo>
```

---

## 4) Підготовка env файлів для production / staging / demo

Створіть окремі env:
```bash
cp backend/.env.production.example backend/.env.production
cp backend/.env.staging.example backend/.env.staging
cp backend/.env.demo.example backend/.env.demo
```

Відкрийте кожен файл у редакторі (nano):
```bash
nano backend/.env.production
nano backend/.env.staging
nano backend/.env.demo
```

### 4.1 production (приклад ключових значень)
```env
MONGO_URL=mongodb://mongodb:27017
DB_NAME=telegram_shop_prod
TENANT_ID=shop_prod
ENVIRONMENT=production
PLATFORM_ADMIN_IDS=123456789
ADMIN_IDS=123456789
BOT_TOKEN=YOUR_PROD_BOT_TOKEN
MONOBANK_BASE_URL=https://send.monobank.ua/jar/YOUR_JAR_ID
MONOBANK_WEBHOOK_SECRET=YOUR_SECRET
TENANT_BACKFILL_ON_STARTUP=false
ACCESS_MODE_OVERRIDE=
```

### 4.2 staging (приклад)
```env
MONGO_URL=mongodb://mongodb:27017
DB_NAME=telegram_shop_staging
TENANT_ID=shop_staging
ENVIRONMENT=staging
PLATFORM_ADMIN_IDS=123456789
ADMIN_IDS=123456789
BOT_TOKEN=YOUR_STAGING_BOT_TOKEN
MONOBANK_BASE_URL=https://send.monobank.ua/jar/YOUR_JAR_ID
MONOBANK_WEBHOOK_SECRET=YOUR_SECRET
TENANT_BACKFILL_ON_STARTUP=false
ACCESS_MODE_OVERRIDE=
```

### 4.3 demo (safe‑by‑default)
```env
MONGO_URL=mongodb://mongodb:27017
DB_NAME=telegram_shop_demo
TENANT_ID=shop_demo
ENVIRONMENT=demo
PLATFORM_ADMIN_IDS=
ADMIN_IDS=
BOT_TOKEN=YOUR_DEMO_BOT_TOKEN
MONOBANK_BASE_URL=
MONOBANK_WEBHOOK_SECRET=
TENANT_BACKFILL_ON_STARTUP=false
ACCESS_MODE_OVERRIDE=soft_freeze
```

**Важливо:**
- кожне середовище має **унікальний DB_NAME**
- **не використовуйте один BOT_TOKEN** для кількох середовищ (Telegram дає 409 conflict)

---

## 5) Запуск усіх середовищ паралельно
```bash
docker compose -f docker-compose.multi.yml up -d --build
```

Перевірити контейнери:
```bash
docker ps
```

Очікувані сервіси:
- `telegram_shop_mongodb`
- `telegram_shop_bot_prod`, `telegram_shop_bot_staging`, `telegram_shop_bot_demo`
- `telegram_shop_backup_prod`, `telegram_shop_backup_staging`, `telegram_shop_backup_demo`

Важливо:
- каталогові зображення зберігаються як локальні файли в `backend/app/assets/catalog_images`
- якщо цей каталог не винесений у persistent volume або не відновлюється з backup, після `docker compose up -d --build` товари можуть лишитися в Mongo, але картинки почнуть віддавати `404 /assets/catalog_images/...`

---

## 6) Smoke‑тести API
```bash
curl http://<YOUR_VPS_IP>:8001/api/health
curl http://<YOUR_VPS_IP>:8002/api/health
curl http://<YOUR_VPS_IP>:8003/api/health
```

Очікувана відповідь:
```json
{"status":"ok"}
```

---

## 7) Smoke‑тести в Telegram
Для кожного бота (prod / staging / demo):
- `/start`
- `/catalog`
- `/cart`

Для demo очікувано:
- перегляд каталогу ✅
- оформлення замовлення ❌ (через `ACCESS_MODE_OVERRIDE=soft_freeze`)

---

## 8) Перевірка backup
Подивитися логи:
```bash
docker compose -f docker-compose.multi.yml logs -f mongo_backup_prod
```

Ручний запуск backup (швидка перевірка):
```bash
docker exec -it telegram_shop_backup_prod /usr/local/bin/backup.sh
```

Перевірити структуру:
```bash
docker exec -it telegram_shop_backup_prod ls -la /backups/production
```

Очікувана структура:
```
/backups/production/20250310-030000/<DB_NAME>/...
```

---

## 9) Налаштування Firewall (UFW)
Якщо потрібен прямий доступ до API:
```bash
sudo ufw allow 8001/tcp
sudo ufw allow 8002/tcp
sudo ufw allow 8003/tcp
sudo ufw enable
sudo ufw status
```

---

## 10) (Опційно) Проксі через Nginx + HTTPS
Якщо хочете мати окремі домени для prod/staging/demo:

1) Встановити nginx:
```bash
sudo apt-get install -y nginx
```

2) Створити три серверні блоки (приклад):
```bash
sudo nano /etc/nginx/sites-available/shop-prod
```

Вміст (prod, порт 8001):
```
server {
    listen 80;
    server_name prod.example.com;

    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Аналогічно для staging/demo (8002/8003).

3) Увімкнути сайти:
```bash
sudo ln -s /etc/nginx/sites-available/shop-prod /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4) SSL (Let’s Encrypt):
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d prod.example.com
```

---

## 11) Оновлення коду
```bash
git pull
docker compose -f docker-compose.multi.yml up -d --build
```

---

## 12) Часті проблеми
- **409 Conflict**: один бот‑токен запущений у двох місцях → зупиніть зайвий інстанс.
- **Бот не відповідає**: перевірте логи `docker compose logs -f bot_prod`.
- **Mongo недоступна**: перевірте `docker ps` та `docker compose logs -f mongodb`.
- **Товари є, але зображення 404**: перевірте, чи існують файли в `backend/app/assets/catalog_images` усередині контейнера. Якщо БД збереглась, а каталог порожній, відновіть його з backup або перегенеруйте картинки з джерел товарів.

---

Якщо хочете, можу додати окремий чек‑лист для Monobank E2E (webhook + перевірка підпису).
