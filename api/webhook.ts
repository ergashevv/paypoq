import { Bot, webhookCallback } from "grammy";
import {
  getUser,
  getOrCreateUser,
  addSock,
  markSockLost,
  markSockFound,
  removeSock,
  getOrCreateGroup,
  addGroupLostSock,
  getGroupLeaderboard,
} from "../lib/db.js";
import {
  getRandom,
  formatSock,
  STATS_TEMPLATES,
  GREETINGS,
  ADD_SOCK_SUCCESS,
  WELCOME_FIRST,
  EMPTY_LIST,
  LOST_REACTIONS,
  FOUND_REACTIONS,
  PREMIUM_PITCH,
  LEADERBOARD_EMPTY,
  LEADERBOARD_HEADER,
  LEADERBOARD_ROW,
} from "../lib/messages.js";
import {
  mainMenu,
  backToMenu,
  sockList,
  sockActions,
  colorChoose,
  emojiChoose,
  groupMenu,
} from "../lib/keyboards.js";
import {
  getAddSockState,
  setAddSockState,
  clearAddSockState,
} from "../lib/session.js";

const token = process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN yoki TELEGRAM_BOT_TOKEN kerak");

const bot = new Bot(token);

// ---------- Private chat ----------

bot.command("start", async (ctx) => {
  const name = ctx.from?.first_name || ctx.from?.username || "do'st";

  if (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup") {
    await getOrCreateGroup(ctx.chat.id, ctx.chat.title || "Guruh");
    await ctx.reply(
      `Salom ${name}! Bu guruhda paypoq yo'qotish reytingi bilan o'ynaymiz.\n\n` +
        "Yo'qotgan paypoqingiz bo'lsa \"Yo'qotdim\" tugmasini bosing.\n\n" +
        "/leaderboard — kim eng ko'p yo'qotganini ko'rish",
      { reply_markup: groupMenu() }
    );
    return;
  }

  const user = await getOrCreateUser(ctx.from!.id, name);
  const isFirst = user.socks.length === 0 && user.totalAdded === 0;
  const msg = isFirst ? getRandom(WELCOME_FIRST) : getRandom(GREETINGS);
  await ctx.reply(`${msg}\n\nNima qilamiz?`, {
    reply_markup: mainMenu(),
  });
});

// Callbacks
bot.callbackQuery("menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup") {
    await ctx.editMessageText(
      "Paypoq yo'qotish reytingi. /leaderboard — reytingni ko'rish.",
      { reply_markup: groupMenu() }
    );
  } else {
    await ctx.editMessageText("Menyu:", { reply_markup: mainMenu() });
  }
});

bot.callbackQuery("add_sock", async (ctx) => {
  await ctx.answerCallbackQuery();
  await clearAddSockState(ctx.from!.id);
  await ctx.editMessageText(
    "Rangni tanlang:",
    { reply_markup: colorChoose() }
  );
});

bot.callbackQuery(/^color:(.+)$/, async (ctx) => {
  const color = ctx.match[1];
  await ctx.answerCallbackQuery();
  await setAddSockState(ctx.from!.id, { color });
  await ctx.editMessageText("Endi emoji tanlang:", {
    reply_markup: emojiChoose(),
  });
});

bot.callbackQuery(/^emoji:(.+)$/, async (ctx) => {
  const emoji = ctx.match[1];
  await ctx.answerCallbackQuery();
  const state = await getAddSockState(ctx.from!.id);
  if (!state) {
    await ctx.editMessageText("Vaqt tugadi, qaytadan boshlang.", {
      reply_markup: mainMenu(),
    });
    return;
  }
  const result = await addSock(ctx.from!.id, {
    color: state.color,
    emoji,
    pattern: "oddiy",
  });
  await clearAddSockState(ctx.from!.id);
  if (result.ok) {
    await ctx.editMessageText(
      `${getRandom(ADD_SOCK_SUCCESS)}\n\n${emoji} ${state.color} paypoq qo'shildi.`,
      { reply_markup: mainMenu() }
    );
  } else {
    await ctx.editMessageText(result.msg || "Xatolik.", {
      reply_markup: mainMenu(),
    });
  }
});

bot.callbackQuery("list_socks", async (ctx) => {
  await ctx.answerCallbackQuery();
  const user = await getOrCreateUser(ctx.from!.id, "");
  if (user.socks.length === 0) {
    await ctx.editMessageText(getRandom(EMPTY_LIST), {
      reply_markup: mainMenu(),
    });
    return;
  }
  await ctx.editMessageText(
    `Ro'yxat (${user.socks.length} ta):\nBirinchini tanlang:`,
    { reply_markup: sockList(user.socks, 0) }
  );
});

bot.callbackQuery(/^page:(\d+)$/, async (ctx) => {
  const page = parseInt(ctx.match[1], 10);
  await ctx.answerCallbackQuery();
  const user = await getOrCreateUser(ctx.from!.id, "");
  await ctx.editMessageText(
    `Ro'yxat (${user.socks.length} ta):`,
    { reply_markup: sockList(user.socks, page) }
  );
});

bot.callbackQuery(/^sock:(.+)$/, async (ctx) => {
  const sockId = ctx.match[1];
  await ctx.answerCallbackQuery();
  const user = await getUser(ctx.from!.id);
  if (!user) return;
  const sock = user.socks.find((s) => s.id === sockId);
  if (!sock) {
    await ctx.editMessageText("Paypoq topilmadi.", {
      reply_markup: backToMenu(),
    });
    return;
  }
  const text = formatSock(sock) + (sock.isLost ? "\n\n(Bir vaqtlar yo'qolgan deb yozilgan edi)" : "");
  await ctx.editMessageText(text, {
    reply_markup: sockActions(sockId, sock.isLost),
  });
});

bot.callbackQuery(/^lost:(.+)$/, async (ctx) => {
  const sockId = ctx.match[1];
  await ctx.answerCallbackQuery();
  const ok = await markSockLost(ctx.from!.id, sockId);
  if (!ok) {
    await ctx.editMessageText("Xatolik yuz berdi.", {
      reply_markup: backToMenu(),
    });
    return;
  }
  const reaction = getRandom(LOST_REACTIONS);
  await ctx.editMessageText(reaction, {
    reply_markup: mainMenu(),
  });
});

bot.callbackQuery(/^found:(.+)$/, async (ctx) => {
  const sockId = ctx.match[1];
  await ctx.answerCallbackQuery();
  const ok = await markSockFound(ctx.from!.id, sockId);
  if (!ok) {
    await ctx.editMessageText("Xatolik.", { reply_markup: backToMenu() });
    return;
  }
  await ctx.editMessageText(getRandom(FOUND_REACTIONS), {
    reply_markup: mainMenu(),
  });
});

bot.callbackQuery(/^del:(.+)$/, async (ctx) => {
  const sockId = ctx.match[1];
  await ctx.answerCallbackQuery();
  const ok = await removeSock(ctx.from!.id, sockId);
  await ctx.editMessageText(
    ok
      ? "O'chirildi. Keyingi paypoqni tanlang yoki menyuga qayting."
      : "Xatolik.",
    { reply_markup: mainMenu() }
  );
});

bot.callbackQuery("stats", async (ctx) => {
  await ctx.answerCallbackQuery();
  const user = await getOrCreateUser(ctx.from!.id, "");
  const total = user.socks.length;
  const lost = user.totalLost;
  const percent = total > 0 ? Math.round((lost / total) * 100) : 0;
  let template = getRandom(STATS_TEMPLATES)
    .replace("{total}", String(total))
    .replace("{lost}", String(lost))
    .replace("{percent}", String(percent));
  if (total === 0) {
    template = "Hali paypoq qo'shmagansiz. Qo'shib ko'ring – keyin statistika chiqadi!";
  } else if (lost === 0) {
    template += "\n\nBarchasi joyida – afsuski hali 😂";
  }
  await ctx.editMessageText(template, {
    reply_markup: mainMenu(),
  });
});

bot.callbackQuery("premium", async (ctx) => {
  await ctx.answerCallbackQuery();
  const user = await getUser(ctx.from!.id);
  const isPremium = user?.isPremium;
  const text = isPremium
    ? "Siz allaqachon Premium foydalanuvchisiz! Cheksiz paypoq qo'shish huquqingiz bor."
    : getRandom(PREMIUM_PITCH);
  await ctx.editMessageText(text, {
    reply_markup: mainMenu(),
  });
});

// ---------- Guruh rejimi ----------

bot.command("leaderboard", async (ctx) => {
  if (ctx.chat?.type !== "group" && ctx.chat?.type !== "supergroup") {
    await ctx.reply("Bu buyruq faqat guruhlarda ishlaydi.");
    return;
  }
  const list = await getGroupLeaderboard(ctx.chat.id);
  if (list.length === 0) {
    await ctx.reply(LEADERBOARD_EMPTY);
    return;
  }
  const lines = [
    LEADERBOARD_HEADER,
    "",
    ...list.slice(0, 10).map((m, i) => LEADERBOARD_ROW(i + 1, m.name, m.lostCount)),
  ];
  await ctx.reply(lines.join("\n"), { reply_markup: groupMenu() });
});

bot.callbackQuery("group_leaderboard", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (!ctx.chat || (ctx.chat.type !== "group" && ctx.chat.type !== "supergroup")) {
    return;
  }
  const list = await getGroupLeaderboard(ctx.chat.id);
  if (list.length === 0) {
    await ctx.editMessageText(LEADERBOARD_EMPTY, {
      reply_markup: groupMenu(),
    });
    return;
  }
  const lines = [
    LEADERBOARD_HEADER,
    "",
    ...list.slice(0, 10).map((m, i) => LEADERBOARD_ROW(i + 1, m.name, m.lostCount)),
  ];
  await ctx.editMessageText(lines.join("\n"), {
    reply_markup: groupMenu(),
  });
});

// Guruhda "Yo'qotdim" - bitta yo'qolgan paypoq qo'shiladi
bot.callbackQuery("group_lost", async (ctx) => {
  if (!ctx.chat || (ctx.chat.type !== "group" && ctx.chat.type !== "supergroup")) {
    await ctx.answerCallbackQuery();
    return;
  }
  const name = ctx.from?.first_name || ctx.from?.username || "Anonim";
  await addGroupLostSock(ctx.chat.id, ctx.from!.id, name);
  const list = await getGroupLeaderboard(ctx.chat.id);
  const myCount = list.find((m) => m.userId === ctx.from!.id)?.lostCount ?? 1;
  await ctx.answerCallbackQuery({
    text: "Yozib qo'ydim 😂",
  });
  await ctx.editMessageReplyMarkup({ reply_markup: groupMenu(myCount) });
});

const handler = webhookCallback(bot, "https");

export default (req: any, res: any) => {
  // GET so'rovlari (brauzer, health check) - tez javob, timeout oldini olish
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }
  return handler(req, res);
};