import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PieChart, Edit3, Plus } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import EditHoldingModal from './EditHoldingModal';
import ChartModal from './ChartModal';
import AddHoldingModal from './AddHoldingModal';

const HoldingsList: React.FC = () => {
  const { stocks, addTransaction, updateHolding, addHolding } = usePortfolio();
  const [editModal, setEditModal] = useState<{ isOpen: boolean; stock: any }>({ isOpen: false, stock: null });
  const [chartModal, setChartModal] = useState<{ isOpen: boolean; stock: any }>({ isOpen: false, stock: null });
  const [addHoldingModal, setAddHoldingModal] = useState(false);

  const holdingStocks = stocks.filter(stock => stock.quantity && stock.quantity > 0);

  const handleTrade = (type: 'buy' | 'sell', symbol: string, name: string, amount: number, price: number) => {
    addTransaction({ type, symbol, name, amount, price });
  };

  const handleUpdateHolding = (symbol: string, quantity: number, averagePrice: number) => {
    updateHolding(symbol, quantity, averagePrice);
  };

  const handleAddHolding = (symbol: string, name: string, quantity: number, averagePrice: number) => {
    addHolding(symbol, name, quantity, averagePrice);
  };

  const totalHoldingValue = holdingStocks.reduce((sum, stock) => sum + (stock.price * (stock.quantity || 0)), 0);

  return (
    <>
      <div className="glass-card p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">보유 종목</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setAddHoldingModal(true)}
              className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 hover:bg-white/5 px-3 py-2 rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
            <div className="text-right">
              <p className="text-xs text-gray-400">총 자산</p>
              <p className="text-xs sm:text-base font-bold text-white">₩{totalHoldingValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {holdingStocks.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <PieChart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-400 mb-2">보유 종목이 없습니다</p>
              <button 
                onClick={() => setAddHoldingModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                첫 종목 추가하기
              </button>
            </div>
          ) : (
            holdingStocks.map((stock) => {
              const holdingValue = stock.price * (stock.quantity || 0);
              const holdingPercent = (holdingValue / totalHoldingValue) * 100;
              const averagePrice = stock.averagePrice || 0;
              const totalCost = averagePrice * (stock.quantity || 0);
              const profit = holdingValue - totalCost;
              const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0;
              
              return (
                <div key={stock.symbol} className="p-3 sm:p-4 hover:bg-white/8 rounded-lg transition-colors border border-gray-600">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex-1">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setChartModal({ isOpen: true, stock })}
                      >
                        <div>
                          <h3 className="text-white font-semibold text-xs sm:text-sm">{stock.name}</h3>
                          <p className="text-gray-400 text-xs">{stock.symbol}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-white font-semibold text-xs sm:text-sm">₩{stock.price.toLocaleString()}</p>
                          <div className="flex items-center justify-end gap-1">
                            {stock.change > 0 ? (
                              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                            ) : (
                              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                            )}
                            <span className={`text-xs font-medium ${
                              stock.change > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {stock.change > 0 ? '+' : ''}{stock.changePercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
                    <div className="bg-gray-800/70 p-2 sm:p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">수량</p>
                      <p className="text-white font-semibold text-xs sm:text-sm">{stock.quantity}주</p>
                    </div>
                    <div className="bg-gray-800/70 p-2 sm:p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">가치</p>
                      <p className="text-white font-semibold text-xs sm:text-sm">₩{holdingValue.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-800/70 p-2 sm:p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">평단가</p>
                      <p className="text-white font-semibold text-xs sm:text-sm">₩{averagePrice.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-800/70 p-2 sm:p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">수익률</p>
                      <p className={`font-semibold text-xs sm:text-sm ${
                        profitPercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* 수익/손실 정보 */}
                  <div className="bg-gray-900/50 p-2 sm:p-3 rounded-lg mb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-xs">평가손익</p>
                        <p className={`font-bold text-xs sm:text-sm ${
                          profit >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {profit >= 0 ? '+' : ''}₩{profit.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">투자원금</p>
                        <p className="text-gray-300 font-semibold text-xs sm:text-sm">₩{totalCost.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-400 text-xs">포트폴리오 비중</span>
                      <span className="text-blue-400 text-xs font-medium">{holdingPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{ width: `${holdingPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setEditModal({ isOpen: true, stock })}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      수정
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <EditHoldingModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, stock: null })}
        stock={editModal.stock}
        onUpdate={handleUpdateHolding}
        onTrade={handleTrade}
      />

      <ChartModal
        isOpen={chartModal.isOpen}
        onClose={() => setChartModal({ isOpen: false, stock: null })}
        stockSymbol={chartModal.stock?.symbol || ''}
        stockName={chartModal.stock?.name || ''}
      />

      <AddHoldingModal
        isOpen={addHoldingModal}
        onClose={() => setAddHoldingModal(false)}
        onAddHolding={handleAddHolding}
      />
    </>
  );
};

export default HoldingsList;