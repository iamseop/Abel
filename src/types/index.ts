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
}

export interface Transaction {
  id: string;
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