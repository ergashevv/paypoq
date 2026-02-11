import { InlineKeyboard } from "grammy";
import type { Paypoq } from "./types.js";

export function mainMenu() {
  return new InlineKeyboard()
    .text("➕ Paypoq qo'shish", "add_sock")
    .row()
    .text("📋 Ro'yxatim", "list_socks")
    .row()
    .text("📊 Statistika", "stats")
    .row()
    .text("🏆 Premium", "premium");
}

export function backToMenu() {
  return new InlineKeyboard().text("◀️ Orqaga", "menu");
}

export function sockActions(sockId: string, isLost: boolean) {
  const kb = new InlineKeyboard();
  if (isLost) {
    kb.text("✅ Topildi!", `found:${sockId}`);
  } else {
    kb.text("❌ Yo'qolgan deb belgilash", `lost:${sockId}`);
  }
  kb.text("🗑 O'chirish", `del:${sockId}`).row();
  kb.text("◀️ Orqaga", "list_socks");
  return kb;
}

export function sockList(socks: Paypoq[], page: number, perPage = 5) {
  const start = page * perPage;
  const chunk = socks.slice(start, start + perPage);
  const kb = new InlineKeyboard();

  for (const s of chunk) {
    const label = `${s.emoji} ${s.color}${s.isLost ? " ❌" : ""}`;
    kb.text(label, `sock:${s.id}`).row();
  }

  if (page > 0) {
    kb.text("⬅️ Oldingi", `page:${page - 1}`);
  }
  if (start + perPage < socks.length) {
    kb.text("Keyingi ➡️", `page:${page + 1}`);
  }
  kb.row().text("◀️ Bosh menyu", "menu");
  return kb;
}

export function colorChoose() {
  const kb = new InlineKeyboard();
  const colors = ["qora", "oq", "ko'k", "qizil", "yashil", "sariq", "pushti", "kulrang", "boshqa"];
  for (let i = 0; i < colors.length; i += 3) {
    const row = colors.slice(i, i + 3);
    for (const c of row) {
      kb.text(c, `color:${c}`);
    }
    kb.row();
  }
  kb.text("◀️ Bekor qilish", "menu");
  return kb;
}

export function emojiChoose() {
  const emojis = ["🧦", "🦶", "✨", "🔥", "😈", "🤡", "🦄", "🐱", "🍎", "🍕"];
  const kb = new InlineKeyboard();
  for (let i = 0; i < emojis.length; i += 5) {
    const row = emojis.slice(i, i + 5);
    for (const e of row) {
      kb.text(e, `emoji:${e}`);
    }
    kb.row();
  }
  kb.text("◀️ Bekor qilish", "menu");
  return kb;
}

export function groupMenu(lostCount?: number) {
  const kb = new InlineKeyboard();
  kb.text(
    lostCount !== undefined ? `Yo'qotdim +1 (jami ${lostCount})` : "Yo'qotdim +1",
    "group_lost"
  ).row();
  kb.text("🏆 Reyting", "group_leaderboard").row();
  kb.text("◀️ Orqaga", "menu");
  return kb;
}
