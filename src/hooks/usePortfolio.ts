import { useState, useEffect } from 'react';
import { Stock, Transaction, Asset, Portfolio } from '../types';

const initialStocks: Stock[] = [
  {
    symbol: 'NVDA',
    name: '엔비디아',
    price: 71000,
    change: 1500,
    changePercent: 2.16,
    volume: 12500000,
    quantity: 59,
    averagePrice: 68500
  },
  {
    symbol: 'AAPL',
    name: '애플',
    price: 89500,
    change: -2100,
    changePercent: -2.29,
    volume: 8900000,
    quantity: 23,
    averagePrice: 92000
  },
  {
    symbol: 'QQQ',
    name: '나스닥 ETF',
    price: 89500,
    change: -2100,
    changePercent: -2.29,
    volume: 8900000,
    quantity: 23,
    averagePrice: 92000
  },
  {
    symbol: 'BTCKRW',
    name: '비트코인',
    price: 185000,
    change: 3500,
    changePercent: 1.93,
    volume: 1200000,
    quantity: 10,
    averagePrice: 178000
  },
  {
    symbol: 'ETHUSDT',
    name: '이더리움',
    price: 185000,
    change: 3500,
    changePercent: 1.93,
    volume: 1200000,
    quantity: 10,
    averagePrice: 178000
  },
  {
    symbol: 'USDKRW',
    name: '달러',
    price: 89500,
    change: -2100,
    changePercent: -2.29,
    volume: 8900000,
    quantity: 23,
    averagePrice: 92000
  },
  
];

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    asset: '삼성전자',
    amount: 10,
    price: 71000,
    time: '2시간 전',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    type: 'sell',
    asset: 'SK하이닉스',
    amount: 5,
    price: 89500,
    time: '4시간 전',
    date: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: '3',
    type: 'buy',
    asset: 'KODEX 200',
    amount: 20,
    price: 38450,
    time: '1일 전',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    type: 'sell',
    asset: 'NAVER',
    amount: 3,
    price: 185000,
    time: '2일 전',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
];

export const usePortfolio = () => {
  const [stocks, setStocks] = useState<Stock[]>(initialStocks);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [watchlist, setWatchlist] = useState<string[]>(['005930', '000660', '035420']);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const priceChange = (Math.random() - 0.5) * 1000;
        const newPrice = Math.max(1000, stock.price + priceChange);
        const changePercent = ((newPrice - stock.price) / stock.price) * 100;
        
        return {
          ...stock,
          price: Math.round(newPrice),
          change: Math.round(newPrice - stock.price),
          changePercent: Number(changePercent.toFixed(2))
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'time' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      time: '방금 전',
      date: new Date()
    };

    setTransactions(prev => [newTransaction, ...prev]);

    setStocks(prev => prev.map(stock => {
      if (stock.name === transaction.asset) {
        const newQuantity = transaction.type === 'buy' 
          ? (stock.quantity || 0) + transaction.amount
          : Math.max(0, (stock.quantity || 0) - transaction.amount);
        return { ...stock, quantity: newQuantity };
      }
      return stock;
    }));
  };

  const addToWatchlist = (symbol: string, name?: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist(prev => [...prev, symbol]);
      
      const existingStock = stocks.find(stock => stock.symbol === symbol);
      if (!existingStock && name) {
        const newStock: Stock = {
          symbol,
          name,
          price: Math.floor(Math.random() * 100000) + 10000,
          change: Math.floor(Math.random() * 2000) - 1000,
          changePercent: Number(((Math.random() - 0.5) * 10).toFixed(2)),
          volume: Math.floor(Math.random() * 10000000) + 1000000,
          quantity: 0
        };
        setStocks(prev => [...prev, newStock]);
      }
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  const updateHolding = (symbol: string, quantity: number, averagePrice: number) => {
    setStocks(prev => prev.map(stock => {
      if (stock.symbol === symbol) {
        return {
          ...stock,
          quantity,
          averagePrice
        };
      }
      return stock;
    }));
  };

  const getAssets = (): Asset[] => {
    const assets: Asset[] = [];
    let totalValue = 0;

    stocks.forEach(stock => {
      if (stock.quantity && stock.quantity > 0) {
        const value = stock.price * stock.quantity;
        totalValue += value;
        assets.push({
          name: stock.name,
          value,
          percentage: 0,
          color: getColorForStock(stock.symbol),
          quantity: stock.quantity
        });
      }
    });

    const etfValue = 2800000;
    totalValue += etfValue;
    assets.push({
      name: 'KODEX 200',
      value: etfValue,
      percentage: 0,
      color: 'bg-purple-500',
      quantity: 73
    });

    return assets.map(asset => ({
      ...asset,
      percentage: (asset.value / totalValue) * 100
    }));
  };

  const getPortfolioSummary = (): Portfolio => {
    const assets = getAssets();
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    const todayChange = stocks.reduce((sum, stock) => {
      if (stock.quantity && stock.quantity > 0) {
        return sum + (stock.change * stock.quantity);
      }
      return sum;
    }, 0);

    const todayChangePercent = totalValue > 0 ? (todayChange / (totalValue - todayChange)) * 100 : 0;
    
    return {
      totalValue,
      todayChange,
      todayChangePercent: Number(todayChangePercent.toFixed(2)),
      monthlyChange: -89340,
      monthlyChangePercent: -0.71
    };
  };

  return {
    stocks,
    transactions,
    watchlist,
    addTransaction,
    addToWatchlist,
    removeFromWatchlist,
    updateHolding,
    getAssets,
    getPortfolioSummary
  };
};

const getColorForStock = (symbol: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-cyan-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-lime-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};