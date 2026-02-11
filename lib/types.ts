export interface Paypoq {
  id: string;
  color: string;
  pattern?: string;
  emoji: string;
  addedAt: number;
  isLost: boolean;
  lostAt?: number;
}

export interface UserData {
  socks: Paypoq[];
  name: string;
  joinedAt: number;
  isPremium: boolean;
  totalAdded: number;
  totalLost: number;
}

export interface GroupMember {
  userId: number;
  name: string;
  lostCount: number;
}

export interface GroupData {
  members: Record<string, GroupMember>;
  name: string;
  createdAt: number;
}
