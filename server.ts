import "dotenv/config";

/**
 * Lokal webhook server - vercel dev rekursiyasini oldini olish uchun.
 * Ishlatish: npm run dev
 * Keyin ngrok/localtunnel bilan URL oling va Telegram webhookni sozlang.
 */
import { createServer } from "http";
import handler from "./api/webhook.js";

const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  if (req.url?.startsWith("/api/webhook") && req.method === "POST") {
    return handler(req as any, res as any);
  }
  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`\n🧦 Paypoqtopar bot: http://localhost:${PORT}/api/webhook\n`);
  console.log("Lokal test uchun ngrok ishlating:");
  console.log("  npx ngrok http 3000\n");
});
