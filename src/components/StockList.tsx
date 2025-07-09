import React, { useState } from 'react';
import { Bookmark, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import TradeModal from './TradeModal';
import AddStockModal from './AddStockModal';

const StockList: React.FC = () => {
  const { stocks, watchlist, addToWatchlist, removeFromWatchlist, addTransaction } = usePortfolio();
  const [tradeModal, setTradeModal] = useState<{ isOpen: boolean; stock: any }>({ isOpen: false, stock: null });
  const [addStockModal, setAddStockModal] = useState(false);

  // 관심 종목만 표시 (보유 여부와 관계없이)
  const watchedStocks = stocks.filter(stock => watchlist.includes(stock.symbol));

  const handleTrade = (type: 'buy' | 'sell', asset: string, amount: number, price: number) => {
    addTransaction({ type, asset, amount, price });
  };

  const handleAddStock = (symbol: string, name: string) => {
    addToWatchlist(symbol, name);
  };

  return (
    <>
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">관심 종목</h2>
          </div>
          <button 
            onClick={() => setAddStockModal(true)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 hover:bg-white/5 px-3 py-2 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>

        <div className="space-y-4">
          {watchedStocks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">관심 종목이 없습니다</p>
              <button 
                onClick={() => setAddStockModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                첫 종목 추가하기
              </button>
            </div>
          ) : (
            watchedStocks.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between p-4 hover:bg-white/8 rounded-lg transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{stock.name}</p>
                      <p className="text-gray-400 text-sm">{stock.symbol}</p>
                      {stock.quantity && stock.quantity > 0 && (
                        <p className="text-blue-400 text-sm">보유: {stock.quantity}주</p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white font-semibold">₩{stock.price.toLocaleString()}</p>
                      <div className="flex items-center gap-1">
                        {stock.change > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          stock.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>{stock.change}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setTradeModal({ isOpen: true, stock })}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      매수
                    </button>
                    <button
                      onClick={() => setTradeModal({ isOpen: true, stock })}
                      disabled={!stock.quantity || stock.quantity === 0}
                      className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Minus className="w-4 h-4" />
                      매도
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(stock.symbol)}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TradeModal
        isOpen={tradeModal.isOpen}
        onClose={() => setTradeModal({ isOpen: false, stock: null })}
        stock={tradeModal.stock}
        onTrade={handleTrade}
      />

      <AddStockModal
        isOpen={addStockModal}
        onClose={() => setAddStockModal(false)}
        onAddStock={handleAddStock}
      />
    </>
  );
};

export default StockList;