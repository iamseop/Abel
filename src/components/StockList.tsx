import React, { useState } from 'react';
import { Bookmark, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import AddStockModal from './AddStockModal';

const StockList: React.FC = () => {
  const { stocks, watchlist, addToWatchlist, removeFromWatchlist } = usePortfolio();
  const [addStockModal, setAddStockModal] = useState(false);

  // 관심 종목만 표시 (보유 여부와 관계없이)
  const watchedStocks = stocks.filter(stock => watchlist.includes(stock.symbol));

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
            <div className="divide-y divide-gray-700/50">
              {watchedStocks.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between py-2 sm:py-3 px-1 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-sm sm:text-base leading-tight">{stock.name}</h3>
                        <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{stock.symbol}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-white font-semibold text-sm sm:text-base leading-tight">₩{stock.price.toLocaleString()}</p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          {stock.change > 0 ? (
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                          )}
                          <span className={`text-xs sm:text-sm font-medium ${
                            stock.change > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {stock.change > 0 ? '+' : ''}{stock.changePercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddStockModal
        isOpen={addStockModal}
        onClose={() => setAddStockModal(false)}
        onAddStock={handleAddStock}
      />
    </>
  );
};

export default StockList;
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">{stock.name}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">{stock.symbol}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-white font-semibold text-sm sm:text-base">₩{stock.price.toLocaleString()}</p>
                      <div className="flex items-center justify-end gap-1">
                        {stock.change > 0 ? (
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                        )}
                        <span className={`text-xs sm:text-sm font-medium ${
                          stock.change > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {stock.change > 0 ? '+' : ''}{stock.changePercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AddStockModal
        isOpen={addStockModal}
        onClose={() => setAddStockModal(false)}
        onAddStock={handleAddStock}
      />
    </>
  );
};

export default StockList;