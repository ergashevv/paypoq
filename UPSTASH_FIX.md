# Upstash URL ni to‘g‘rilash

`https://xxx.upstash.io` – bu placeholder, ishlamaydi. Haqiqiy URL kerak.

## 1. Upstash Console

1. [console.upstash.com](https://console.upstash.com) → Redis
2. "paypoq" database ni oching
3. **REST API** bo‘limida:
   - **UPSTASH_REDIS_REST_URL** – masalan: `https://eu1-steady-12345.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN** – uzun token

## 2. Vercel env yangilash

Vercel → paypoq → Settings → Environment Variables:

| Name | Value (Upstash dan nusxalang) |
|------|------------------------------|
| UPSTASH_REDIS_REST_URL | https://...-12345.upstash.io |
| UPSTASH_REDIS_REST_TOKEN | AXXX... |

## 3. Redeploy

Settings → Deployments → oxirgi deployment → "Redeploy" (yoki yangi commit push qiling).
