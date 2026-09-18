import { create } from 'zustand';
import { Exchange } from '../types';

interface ExchangeState {
  activeExchange: Exchange | null;
  pendingRequests: Exchange[];
  setActiveExchange: (exchange: Exchange | null) => void;
  setPendingRequests: (requests: Exchange[]) => void;
}

export const useExchangeStore = create<ExchangeState>((set) => ({
  activeExchange: null,
  pendingRequests: [],
  setActiveExchange: (exchange) => set({ activeExchange: exchange }),
  setPendingRequests: (requests) => set({ pendingRequests: requests }),
}));
