import React, { useEffect, useState, memo } from 'react';
import { DollarSign } from 'lucide-react';
import { formatCurrencyNoDecimals, formatNumber } from '../../utils/formatters';

interface OrderBookProps {
  symbol: string;
  currentPrice: number;
}

interface OrderBookEntry {
  price: number;
  quantity: number;
}

const generateMockOrderBook = (basePrice: number): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } => {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  const priceLevels = 10; // 표시할 호가 레벨 수
  const priceStep = basePrice * 0.0001; // 가격 간격 (0.01%)
  const minQuantity = 0.001;
  const maxQuantity = 0.05;

  // 매수 호가 (Bids)
  for (let i = 0; i < priceLevels; i++) {
    const price = basePrice - (priceStep * (i + 1));
    const quantity = minQuantity + Math.random() * (maxQuantity - minQuantity);
    bids.push({ price: parseFloat(price.toFixed(8)), quantity: parseFloat(quantity.toFixed(4)) });
  }

  // 매도 호가 (Asks)
  for (let i = 0; i < priceLevels; i++) {
    const price = basePrice + (priceStep * (i + 1));
    const quantity = minQuantity + Math.random() * (maxQuantity - minQuantity);
    asks.push({ price: parseFloat(price.toFixed(8)), quantity: parseFloat(quantity.toFixed(4)) });
  }

  return {
    bids: bids.sort((a, b) => b.price - a.price), // 높은 가격부터
    asks: asks.sort((a, b) => a.price - b.price), // 낮은 가격부터
  };
};

const OrderBook: React.FC<OrderBookProps> = ({ symbol, currentPrice }) => {
  const [orderBookData, setOrderBookData] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] } | null>(null);

  useEffect(() => {
    if (currentPrice > 0) {
      const mockData = generateMockOrderBook(currentPrice);
      setOrderBookData(mockData);

      // 2초마다 호가창 데이터 업데이트 (실시간처럼 보이게)
      const interval = setInterval(() => {
        const newMockData = generateMockOrderBook(currentPrice + (Math.random() - 0.5) * currentPrice * 0.0005); // 가격을 미세하게 변동
        setOrderBookData(newMockData);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentPrice, symbol]);

  if (!orderBookData) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
        호가창 데이터를 불러오는 중...
      </div>
    );
  }

  const maxQuantity = Math.max(
    ...orderBookData.bids.map(b => b.quantity),
    ...orderBookData.asks.map(a => a.quantity)
  );

  return (
    <div className="flex flex-col h-full bg-[var(--input-background)] rounded-lg overflow-hidden">
      <div className="p-3 border-b border-[var(--input-border)]">
        <h3 className="text-base font-bold text-[var(--text-primary)] text-center">호가창</h3>
      </div>
      <div className="flex-1 flex flex-col text-xs">
        {/* 매도 호가 (Asks) */}
        <div className="flex-1 flex flex-col-reverse overflow-hidden">
          {orderBookData.asks.map((entry, index) => (
            <div key={`ask-${index}`} className="relative flex justify-between items-center py-1 px-3 hover:bg-[var(--card-background-hover)] transition-colors cursor-pointer">
              <div 
                className="absolute right-0 h-full bg-[var(--text-accent-red)]/20" 
                style={{ width: `${(entry.quantity / maxQuantity) * 100}%` }}
              ></div>
              <span className="text-[var(--text-accent-red)] font-semibold z-10">{formatCurrencyNoDecimals(entry.price)}</span>
              <span className="text-[var(--text-primary)] z-10">{formatNumber(entry.quantity, { maximumFractionDigits: 4 })}</span>
            </div>
          ))}
        </div>

        {/* 현재가 */}
        <div className="bg-[var(--text-primary)]/10 py-2 px-3 flex justify-between items-center border-y border-[var(--input-border)]">
          <span className="text-[var(--text-secondary)]">현재가</span>
          <span className="text-[var(--text-primary)] font-bold text-base">₩{formatCurrencyNoDecimals(currentPrice)}</span>
        </div>

        {/* 매수 호가 (Bids) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {orderBookData.bids.map((entry, index) => (
            <div key={`bid-${index}`} className="relative flex justify-between items-center py-1 px-3 hover:bg-[var(--card-background-hover)] transition-colors cursor-pointer">
              <div 
                className="absolute left-0 h-full bg-[var(--text-accent-green)]/20" 
                style={{ width: `${(entry.quantity / maxQuantity) * 100}%` }}
              ></div>
              <span className="text-[var(--text-accent-green)] font-semibold z-10">{formatCurrencyNoDecimals(entry.price)}</span>
              <span className="text-[var(--text-primary)] z-10">{formatNumber(entry.quantity, { maximumFractionDigits: 4 })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(OrderBook);