export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  quantity?: number;
  averagePrice?: number;
}

export interface UserStock {
  id: string;
  user_id: string;
  symbol: string;
  quantity: number;
  average_price: number;
  created_at: string;
  updated_at: string;
  name?: string; // 새로 추가된 name 필드 (선택 사항으로 정의)
}

export interface Transaction {
  id: string;
  user_id: string; // Added user_id to match DB
  type: 'buy' | 'sell';
  asset_name: string; // Changed from 'asset' to 'asset_name' to match DB
  symbol: string; // Added symbol for transactions
  amount: number;
  price: number;
  transaction_time: string; // Changed from 'time' to 'transaction_time' to match DB
  date: Date; // For client-side display/sorting
}

export interface UserWatchlist {
  id: string;
  user_id: string;
  symbol: string;
  created_at: string;
  coingecko_id?: string; // CoinGecko ID 추가
}

export interface Asset {
  name: string;
  value: number;
  percentage: number;
  color: string;
  quantity: number;
}

export interface Portfolio {
  totalValue: number;
  todayChange: number;
  todayChangePercent: number;
  monthlyChange: number;
  monthlyChangePercent: number;
}

// 선물 포지션 인터페이스 추가
export interface FuturesPosition {
  id: string;
  user_id: string;
  symbol: string;
  position_side: 'LONG' | 'SHORT';
  quantity: number;
  entry_price: number;
  leverage: number;
  liquidation_price: number | null;
  created_at: string;
  updated_at: string;
  current_price?: number; // 실시간 가격 (UI 표시용)
  unrealized_pnl?: number; // 미실현 손익 (UI 표시용)
  unrealized_pnl_percent?: number; // 미실현 손익률 (UI 표시용)
}

// 선물 거래 내역 인터페이스 추가
export interface FuturesTransaction {
  id: string;
  user_id: string;
  symbol: string;
  type: 'OPEN_LONG' | 'CLOSE_LONG' | 'OPEN_SHORT' | 'CLOSE_SHORT' | 'LIQUIDATION';
  quantity: number;
  price: number;
  leverage: number | null;
  fee: number | null;
  transaction_time: string;
}