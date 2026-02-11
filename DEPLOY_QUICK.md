# Tez deploy – bot ishlashi uchun

Telegram **localhost** ga yeta olmaydi. Server internetda bo'lishi kerak.

## Vercelga deploy (5 daqiqa)

### 1. GitHubga yuklash
```bash
cd /Users/edevzi/Desktop/paypoq
git init
git add .
git commit -m "Paypoq bot"
git remote add origin https://github.com/YOUR_USERNAME/paypoq.git
git push -u origin main
```

### 2. Vercel
- vercel.com → **New Project** → GitHub repo tanlang
- **Environment Variables** qo'shing:
  - `BOT_TOKEN` = .env dagi TELEGRAM_BOT_TOKEN
  - `UPSTASH_REDIS_REST_URL` = .env dagi qiymat
  - `UPSTASH_REDIS_REST_TOKEN` = .env dagi qiymat
- **Deploy** bosing

### 3. Webhook sozlash

Deploy tugagach (masalan: `paypoq-xxx.vercel.app`), brauzerda oching:

```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<VERCEL-URL>.vercel.app/api/webhook
```

`PAYPOQ-VERCEL-URL` o'rniga Vercel bergan haqiqiy URL (masalan: `paypoq-abc123.vercel.app`).

Javob `"ok":true` bo'lsa – tayyor. Bot javob beradi.

---

**Yoki lokal + ngrok:** ngrok.com → yangi authtoken → `ngrok config add-authtoken TOKEN` → `ngrok http 3001` → chiqgan URLni webhookga qo'ying.
