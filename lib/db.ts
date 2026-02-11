import { Redis } from "@upstash/redis";
import type { UserData, Paypoq, GroupData, GroupMember } from "./types.js";

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("UPSTASH_REDIS_REST_URL va UPSTASH_REDIS_REST_TOKEN kerak");
  }
  return new Redis({ url, token });
}

const FREE_SOCK_LIMIT = 10;
const PREMIUM_SOCK_LIMIT = 100;

export async function getUser(userId: number): Promise<UserData | null> {
  try {
    const redis = getRedis();
    const data = await redis.get<UserData>(`user:${userId}`);
    return data;
  } catch {
    return null;
  }
}

export async function getOrCreateUser(
  userId: number,
  name: string
): Promise<UserData> {
  const existing = await getUser(userId);
  if (existing) return existing;

  const newUser: UserData = {
    socks: [],
    name: name || "Paypoqchi",
    joinedAt: Date.now(),
    isPremium: false,
    totalAdded: 0,
    totalLost: 0,
  };

  try {
    const redis = getRedis();
    await redis.set(`user:${userId}`, newUser);
  } catch (e) {
    console.error("DB error:", e);
  }
  return newUser;
}

export async function addSock(
  userId: number,
  sock: Omit<Paypoq, "id" | "addedAt" | "isLost" | "lostAt">
): Promise<{ ok: boolean; msg?: string }> {
  const user = await getOrCreateUser(userId, "");
  const limit = user.isPremium ? PREMIUM_SOCK_LIMIT : FREE_SOCK_LIMIT;

  if (user.socks.length >= limit) {
    return {
      ok: false,
      msg: `Limitdan oshib ketdingiz 😅 Free da ${FREE_SOCK_LIMIT} tagacha. Premium bilan cheksiz!`,
    };
  }

  const newSock: Paypoq = {
    ...sock,
    id: `sock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    addedAt: Date.now(),
    isLost: false,
  };

  user.socks.push(newSock);
  user.totalAdded += 1;

  try {
    const redis = getRedis();
    await redis.set(`user:${userId}`, user);
    return { ok: true };
  } catch (e) {
    console.error("DB error:", e);
    return { ok: false, msg: "Xatolik yuz berdi, qaytadan urinib ko'ring" };
  }
}

export async function markSockLost(
  userId: number,
  sockId: string
): Promise<boolean> {
  const user = await getUser(userId);
  if (!user) return false;

  const sock = user.socks.find((s) => s.id === sockId);
  if (!sock || sock.isLost) return false;

  sock.isLost = true;
  sock.lostAt = Date.now();
  user.totalLost += 1;

  try {
    const redis = getRedis();
    await redis.set(`user:${userId}`, user);
    return true;
  } catch (e) {
    console.error("DB error:", e);
    return false;
  }
}

export async function markSockFound(
  userId: number,
  sockId: string
): Promise<boolean> {
  const user = await getUser(userId);
  if (!user) return false;

  const sock = user.socks.find((s) => s.id === sockId);
  if (!sock || !sock.isLost) return false;

  sock.isLost = false;
  sock.lostAt = undefined;
  user.totalLost = Math.max(0, user.totalLost - 1);

  try {
    const redis = getRedis();
    await redis.set(`user:${userId}`, user);
    return true;
  } catch (e) {
    console.error("DB error:", e);
    return false;
  }
}

export async function removeSock(
  userId: number,
  sockId: string
): Promise<boolean> {
  const user = await getUser(userId);
  if (!user) return false;

  const idx = user.socks.findIndex((s) => s.id === sockId);
  if (idx === -1) return false;

  const wasLost = user.socks[idx].isLost;
  user.socks.splice(idx, 1);
  if (wasLost) user.totalLost = Math.max(0, user.totalLost - 1);

  try {
    const redis = getRedis();
    await redis.set(`user:${userId}`, user);
    return true;
  } catch (e) {
    console.error("DB error:", e);
    return false;
  }
}

export async function setPremium(userId: number, isPremium: boolean): Promise<void> {
  const user = await getUser(userId);
  if (!user) return;
  user.isPremium = isPremium;
  try {
    const redis = getRedis();
    await redis.set(`user:${userId}`, user);
  } catch (e) {
    console.error("DB error:", e);
  }
}

// Guruh rejimi
export async function getGroup(groupId: number): Promise<GroupData | null> {
  try {
    const redis = getRedis();
    return await redis.get<GroupData>(`group:${groupId}`);
  } catch {
    return null;
  }
}

export async function getOrCreateGroup(
  groupId: number,
  groupName: string
): Promise<GroupData> {
  const existing = await getGroup(groupId);
  if (existing) return existing;

  const newGroup: GroupData = {
    members: {},
    name: groupName || "Paypoq guruhi",
    createdAt: Date.now(),
  };

  try {
    const redis = getRedis();
    await redis.set(`group:${groupId}`, newGroup);
  } catch (e) {
    console.error("DB error:", e);
  }
  return newGroup;
}

export async function addGroupLostSock(
  groupId: number,
  userId: number,
  userName: string
): Promise<void> {
  const group = await getOrCreateGroup(groupId, "");
  const key = String(userId);
  if (!group.members[key]) {
    group.members[key] = { userId, name: userName, lostCount: 0 };
  }
  group.members[key].lostCount += 1;
  group.members[key].name = userName;

  try {
    const redis = getRedis();
    await redis.set(`group:${groupId}`, group);
  } catch (e) {
    console.error("DB error:", e);
  }
}

export async function getGroupLeaderboard(
  groupId: number
): Promise<GroupMember[]> {
  const group = await getGroup(groupId);
  if (!group) return [];
  return Object.values(group.members).sort(
    (a, b) => b.lostCount - a.lostCount
  );
}
