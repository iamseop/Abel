import React, { useState } from 'react';
import { Stock } from '../types';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
  onTrade: (type: 'buy' | 'sell', asset: string, amount: number, price: number) => void;
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, stock, onTrade }) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  React.useEffect(() => {
    if (stock) {
      setPrice(stock.price.toString());
    }
  }, [stock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stock || !amount || !price) return;

    const numAmount = parseInt(amount);
    const numPrice = parseInt(price);

    if (numAmount > 0 && numPrice > 0) {
      onTrade(tradeType, stock.name, numAmount, numPrice);
      setAmount('');
      onClose();
    }
  };

  if (!isOpen || !stock) return null;

  const totalValue = parseInt(amount || '0') * parseInt(price || '0');
  const maxSellAmount = stock.quantity || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-white mb-6">
          {stock.name} {tradeType === 'buy' ? '매수' : '매도'}
        </h2>

        <div className="mb-6">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                tradeType === 'buy'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              매수
            </button>
            <button
              type="button"
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                tradeType === 'sell'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              매도
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              현재가
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="가격 입력"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              수량
              {tradeType === 'sell' && (
                <span className="text-gray-400 ml-2">(보유: {maxSellAmount}주)</span>
              )}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={tradeType === 'sell' ? maxSellAmount : undefined}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="수량 입력"
            />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">총 금액</span>
              <span className="text-white font-bold">
                ₩{totalValue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!amount || !price || (tradeType === 'sell' && parseInt(amount) > maxSellAmount)}
              className={`flex-1 py-3 font-semibold rounded-lg transition-colors ${
                tradeType === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {tradeType === 'buy' ? '매수' : '매도'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;