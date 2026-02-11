# Paypoqtopar Bot 🧦

Paypoqlaringizni kuzatadigan va yo'qolganlarini topadigan kulguli Telegram bot. Vercel serverlessda ishlaydi.

## Nima qiladi?

**Shaxsiy chatda:**
- Paypoq qo'shish (rang + emoji)
- Ro'yxatni ko'rish va "yo'qolgan" deb belgilash
- Topilsa "Topildi!" deb belgilash
- Statistika (nechta bor, nechtasi yo'qolgan)
- Premium rejim (cheksiz paypoq)

**Guruhda:**
- "Yo'qotdim" — bir marta bosish = +1 yo'qolgan
- /leaderboard — kim eng ko'p yo'qotganini ko'rish
- O'zaro reyting, shunchaki o'yin

## Deploy (Vercel)

### 1. Repozitoriyani GitHubga yuklang

```bash
git init
git add .
git commit -m "Paypoqtopar bot"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Vercelga ulash

1. [vercel.com](https://vercel.com) → New Project → GitHub repo tanlang
2. Root Directory: `.` (default)
3. Framework: Other
4. Build: `npm run build` (yoki bo'sh qoldiring – Vercel avtomatik build qiladi)

### 3. Environment variables

Vercel → Project → Settings → Environment Variables:

| Name | Value |
|------|-------|
| `BOT_TOKEN` | Telegram @BotFather dan olingan token |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |

### 4. Upstash Redis

1. [console.upstash.com](https://console.upstash.com) → Create Database
2. Region: Yaqinroq (masalan eu-central-1)
3. Yarating → REST API bo'limidan URL va token oling
4. Vercel env ga qo'shing

### 5. Webhook sozlash

Deploy tugagach, brauzerda oching:

```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<your-app>.vercel.app/api/webhook
```

`<BOT_TOKEN>` va `<your-app>` ni o'zingizga almashtiring.

Javob: `{"ok":true,"result":true,...}` bo'lsa, bajarildi.

### 6. Botni sinab ko'ring

Telegramda botni toping va `/start` yuboring.

## Lokal ishlatish

```bash
npm install
npm run dev
```

Lokal uchun [ngrok](https://ngrok.com) yoki [localtunnel](https://localtunnel.github.io/www/) orqali URL oling va webhookni shu URLga qo'ying.

## Loyiha strukturasi

```
.
├── api/
│   └── webhook.ts    # Asosiy bot (Vercel serverless)
├── lib/
│   ├── db.ts         # Upstash Redis
│   ├── keyboards.ts  # Inline tugmalar
│   ├── messages.ts   # Kulguli matnlar
│   ├── session.ts    # Qo'shish holati
│   └── types.ts
├── package.json
├── vercel.json
└── README.md
```

## Premium

Hozircha Premium faqat "cheksiz paypoq" qo'shish uchun. Keyinchalik to'lov (masalan, Telegram Stars) qo'shilishi mumkin. Birinchi premium foydalanuvchi bo'lish uchun – admin bilan bog'laning 😉
