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

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  asset: string;
  amount: number;
  price: number;
  time: string;
  date: Date;
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