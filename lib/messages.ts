// Tabiiy, qiziqarli, insoniy matnlar - robot tilida emas!

export const SOCK_EMOJIS = [
  "🧦", "🦶", "👣", "🧵", "✨", "🌟", "💫", "🔥", "💀", "🎃",
  "😈", "🤡", "👻", "🦄", "🐱", "🐶", "🐼", "🦁", "🐸", "🦋",
  "🍎", "🍋", "🍇", "🍓", "🍕", "🌶️", "🥑", "🍩", "🧁", "🍭",
];

export const COLORS = [
  "qora", "oq", "kulrang", "qizil", "ko'k", "yashil", "sariq", "pushti",
  "binafsha", "to'q sariq", "moviy", "zangori", "mint", "salmon", "bej",
];

export const PATTERNS = [
  "oddiy", "chiziqli", "nuqtali", "rangdor", "naqshli", "striped",
  "polka dot", "jigarrang", "karamee", "yo'q",
];

export const LOST_REACTIONS = [
  "Heh, yana bitta! 😂 Mayin chiqdi, yo'qolmasin deb o'ylab qo'y.",
  "Yo'qoldi demoq... Kim biladi, ehtimol uy hayvonlaringdan biri yashirib qo'ygan? 🐕",
  "O'sha paypoq ham ketdi-a. Umuman bezovta bo'lma, erta kelsa keladi.",
  "Ro'yxatdan o'chirdim. Endi u erda joy ham yo'q, hisobga olmaymiz 😅",
  "Tamom, \"yo'qolgan\" deb yozib qo'ydim. Keyin topilsa, menga xabar ber!",
  "Qayerdadir u ham... Ehtimol pishiruv stolida yoki yotoq ostida? 🤔",
  "Yozildi. Keyingi safar mashinada yuvganda diqqat qil, u yerda ko'p yo'qoladi.",
];

export const FOUND_REACTIONS = [
  "Topildi! 🎉 Yaxshi, hali ham umid bor.",
  "Ajoyib! Demak, u yerda emas edi, balki boshqa joyda edi 😄",
  "Qaytib keldi! Endi ehtiyot bo'l, yana yo'qotma.",
  "Topildi demoq... Yuvish mashinasi allaqachon yeb yuborgan bo'lishi mumkin edi lekin yo'q ekan!",
];

export const STATS_TEMPLATES = [
  "Senda {total} ta paypoq bor. {lost} tasi \"qayerdadir\" 😏",
  "Hisob: {total} ta ro'yxatda, {lost} tasi yo'qolgan deb belgilangan. Qolgani senga ma'lum.",
  "Statistika: {total} ta qo'shilgan, {lost} tasi yo'qolgan. {percent}% yo'qolgan – bu odatdagidek 😄",
  "{total} ta ro'yxatda, {lost} tasi yo'qolgan. Yuvish mashinasi ularni yeb yuborgan bo'lishi mumkin.",
];

export const GREETINGS = [
  "Salom! Paypoqlaringni hisobga olaylikmi? 😄",
  "Qalaysan! Bu yerda paypoq masalasi hal qilamiz.",
  "Xush kelibsiz! Paypoq hisoblagichga tushding.",
  "Assalom! Paypoqlaring qayerda ekanligini kuzatamiz.",
];

export const ADD_SOCK_SUCCESS = [
  "Qo'shildi! Endi ro'yxatda.",
  "Yozib qo'ydim 👍",
  "Ro'yxatga kiritildi. Keyingi paypoqni qo'shamizmi?",
  "Ok, yangi paypoq ro'yxatda.",
];

export const WELCOME_FIRST = [
  "Birinchisi! 🧦 Endi paypoqlaringni qo'sha boshlashing mumkin.",
  "Boshladik! Birinchi paypoqni qo'sh - keyin ko'ramiz nechta bo'ladi.",
  "Juda yaxshi, ro'yxatdan o'tding. Birinchi paypoqni kirit.",
];

export const EMPTY_LIST = [
  "Hali hech narsa yo'q. Paypoq qo'shishdan boshlang!",
  "Ro'yxat bo'sh. Birinchi paypoqni qo'shib ko'ring.",
  "Hech narsa yo'q. Qo'shish tugmasini bosing.",
];

export const PREMIUM_PITCH = [
  "Premium bilan cheksiz paypoq qo'shish mumkin. Va batafsil statistika!",
  "10 tadan ortiq paypoq qo'shmoqchi bo'lsang - Premium kerak. Birinchi premium foydalanuvchi bo'lish mumkin 😉",
  "Free rejimda 10 tagacha. Premium = cheksiz + qiziqarli statlar.",
];

export const LEADERBOARD_EMPTY =
  "Hali hech kim \"Yo'qotdim\" demagan. Birinchi bo'lib boshing – o'zingdan xafa bo'lmaydi 😄";
export const LEADERBOARD_HEADER = "Guruhda eng ko'p paypoq yo'qotganlar 🏆";
export const LEADERBOARD_ROW = (place: number, name: string, count: number) =>
  `${place}. ${name} — ${count} ta yo'qolgan`;

export function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function formatSock(s: { emoji: string; color: string; pattern?: string; isLost: boolean }) {
  const lost = s.isLost ? " ❌ yo'qolgan" : "";
  const p = s.pattern && s.pattern !== "yo'q" ? `, ${s.pattern}` : "";
  return `${s.emoji} ${s.color}${p}${lost}`;
}
