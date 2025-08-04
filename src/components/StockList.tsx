import React, { useState } from 'react';
import { Bookmark, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import AddStockModal from './AddStockModal';
import ChartModal from './ChartModal';

const StockList: React.FC = () => {
  const { stocks, watchlist, addToWatchlist, removeFromWatchlist } = usePortfolio();
  const [addStockModal, setAddStockModal] = useState(false);
  const [chartModal, setChartModal] = useState<{ isOpen: boolean; stock: any }>({ isOpen: false, stock: null });

  // 관심 종목만 표시 (보유 여부와 관계없이)
  const watchedStocks = stocks.filter(stock => watchlist.includes(stock.symbol));

  const handleAddStock = (symbol: string, name: string) => {
    addToWatchlist(symbol, name);
  };

  return (
    <>
      <div className="glass-card p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-[var(--text-accent-blue)]" />
            <h2 className="text-lg font-bold text-[var(--text-primary)]">관심 종목</h2>
          </div>
          <button 
            onClick={() => setAddStockModal(true)}
            className="text-[var(--text-accent-blue)] hover:text-[var(--text-accent-blue)] text-xs font-medium flex items-center gap-1 hover:bg-[var(--card-background-hover)] px-3 py-2 rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>

        <div className="space-y-3">
          {watchedStocks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[var(--text-secondary)] mb-4">관심 종목이 없습니다</p>
              <button 
                onClick={() => setAddStockModal(true)}
                className="px-4 py-2 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] text-[var(--text-primary)] rounded-lg transition-colors"
              >
                첫 종목 추가하기
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[var(--input-border)]">
              {watchedStocks.map((stock) => (
                <div 
                  key={stock.symbol} 
                  className="flex items-center justify-between py-2 sm:py-3 px-1 hover:bg-[var(--card-background-hover)] rounded-lg transition-colors cursor-pointer"
                  onClick={() => setChartModal({ isOpen: true, stock })}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[var(--text-primary)] font-semibold text-xs sm:text-sm leading-tight">{stock.name}</h3>
                        <p className="text-[var(--text-secondary)] text-xs mt-0.5">{stock.symbol}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-[var(--text-primary)] font-semibold text-xs sm:text-sm leading-tight">₩{stock.price.toLocaleString()}</p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          {stock.change > 0 ? (
                            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--text-accent-green)]" />
                          ) : (
                            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--text-accent-red)]" />
                          )}
                          <span className={`text-xs font-medium ${
                            stock.change > 0 ? 'text-[var(--text-accent-green)]' : 'text-[var(--text-accent-red)]'
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

      <ChartModal
        isOpen={chartModal.isOpen}
        onClose={() => setChartModal({ isOpen: false, stock: null })}
        stockSymbol={chartModal.stock?.symbol || ''}
        stockName={chartModal.stock?.name || ''}
      />
    </>
  );
};

export default StockList;