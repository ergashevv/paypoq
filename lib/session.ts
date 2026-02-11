// Oddiy session - qo'shish jarayonida holatni saqlash

const SESSION_TTL = 60 * 15; // 15 minut

export interface AddSockState {
  color: string;
  emoji?: string;
  pattern?: string;
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis");
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function getAddSockState(userId: number): Promise<AddSockState | null> {
  try {
    const redis = await getRedis();
    if (!redis) return null;
    return await redis.get<AddSockState>(`add_sock:${userId}`);
  } catch {
    return null;
  }
}

export async function setAddSockState(
  userId: number,
  state: AddSockState
): Promise<void> {
  try {
    const redis = await getRedis();
    if (!redis) return;
    await redis.set(`add_sock:${userId}`, state, { ex: SESSION_TTL });
  } catch (e) {
    console.error("Session error:", e);
  }
}

export async function clearAddSockState(userId: number): Promise<void> {
  try {
    const redis = await getRedis();
    if (!redis) return;
    await redis.del(`add_sock:${userId}`);
  } catch (e) {
    console.error("Session error:", e);
  }
}
