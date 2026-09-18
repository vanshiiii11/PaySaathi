export enum ExchangeDirection {
  CASH_TO_UPI = 'CASH_TO_UPI',
  UPI_TO_CASH = 'UPI_TO_CASH',
}

export enum ExchangeStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface User {
  id: string;
  phone: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  rating: number;
  ratingCount: number;
  exchangeCount: number;
  isActive: boolean;
  intent?: ExchangeDirection;
  minAmount?: number;
  maxAmount?: number;
  radiusKm?: number;
  createdAt: string;
}

export interface NearbyUser extends User {
  distanceKm: number;
  fuzzedLat: number;
  fuzzedLng: number;
}

export interface Exchange {
  id: string;
  requesterId: string;
  partnerId: string;
  direction: ExchangeDirection;
  amount: number;
  status: ExchangeStatus;
  note?: string;
  meetingPoint?: string;
  expiresAt: string;
  createdAt: string;
  completedAt?: string;
  requester?: User;
  partner?: User;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'SYSTEM' | 'IMAGE';
  isRead: boolean;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  exchangeId: string;
  messages?: Message[];
}

export interface Rating {
  id: string;
  exchangeId: string;
  raterId: string;
  rateeId: string;
  stars: number;
  tags: string[];
  comment?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  details?: string;
  exchangeId?: string;
}
