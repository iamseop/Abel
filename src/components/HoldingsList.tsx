import React, { useState } from 'react';
import { TrendingUp, TrendingDown, PieChart, Edit3, Plus, Trash2, DollarSign } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import EditHoldingModal from './EditHoldingModal';
import ChartModal from './ChartModal';
import AddHoldingModal from './AddHoldingModal';
import Modal from './Modal'; // Modal 컴포넌트 임포트
import { showSuccess, showError } from '../utils/toast'; // 토스트 유틸리티 임포트
import { formatNumber, formatCurrencyNoDecimals, formatPercentage } from '../utils/formatters';

const HoldingsList: React.FC = () => {
  const { stocks, addTransaction, updateHolding, addHolding, deleteHolding } = usePortfolio();
  const [editModal, setEditModal] = useState<{ isOpen: boolean; stock: any }>({ isOpen: false, stock: null });
  const [chartModal, setChartModal] = useState<{ isOpen: boolean; stock: any }>({ isOpen: false, stock: null });
  const [addHoldingModal, setAddHoldingModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false); // 확인 모달 상태
  const [stockToDelete, setStockToDelete] = useState<any>(null); // 삭제할 종목 상태

  const holdingStocks = stocks.filter(stock => stock.quantity && stock.quantity > 0);

  const handleTrade = (type: 'buy' | 'sell', symbol: string, name: string, amount: number, price: number) => {
    addTransaction({ type, symbol, name, amount, price });
  };

  const handleUpdateHolding = (symbol: string, quantity: number, averagePrice: number, name: string) => {
    updateHolding(symbol, quantity, averagePrice, name);
  };

  const handleAddHolding = (symbol: string, name: string, quantity: number, averagePrice: number) => {
    addHolding(symbol, name, quantity, averagePrice);
  };

  const handleDeleteClick = (stock: any) => { // 삭제 버튼 클릭 시 확인 모달 열기
    setStockToDelete(stock);
    setShowConfirmDeleteModal(true);
  };

  const confirmDelete = async () => { // 확인 모달에서 삭제 확정 시 호출
    if (stockToDelete) {
      await deleteHolding(stockToDelete.symbol);
      setShowConfirmDeleteModal(false);
      setStockToDelete(null);
    }
  };

  const totalHoldingValue = holdingStocks.reduce((sum, stock) => sum + (stock.price * (stock.quantity || 0)), 0);

  return (
    <>
      <div className="glass-card p-4 sm:p-6 mb-4">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-accent-green)]" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">보유 종목</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setAddHoldingModal(true)}
              className="text-[var(--text-accent-blue)] hover:text-[var(--text-accent-blue)] text-xs font-medium flex items-center gap-1 hover:bg-[var(--card-background-hover)] px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
            <div className="text-right">
              <p className="text-xs text-[var(--text-secondary)]">총 자산</p>
              <p className="text-xs sm:text-base font-bold text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(totalHoldingValue)}</p>
            </div>
          </div>
        </div>

        <div> 
          {holdingStocks.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <PieChart className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--text-secondary)] mx-auto mb-3 sm:mb-4" />
              <p className="text-[var(--text-secondary)] mb-2">보유 종목이 없습니다</p>
              <button 
                onClick={() => setAddHoldingModal(true)}
                className="px-4 py-2 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] text-[var(--text-primary)] rounded-lg transition-colors"
              >
                첫 종목 추가하기
              </button>
            </div>
          ) : (
            holdingStocks.map((stock) => {
              const holdingValue = stock.price * (stock.quantity || 0);
              const totalCost = (stock.averagePrice || 0) * (stock.quantity || 0);
              const profit = holdingValue - totalCost;
              const profitPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0;
              const portfolioWeight = totalHoldingValue > 0 ? (holdingValue / totalHoldingValue) * 100 : 0;
              
              return (
                <div 
                  key={stock.symbol} 
                  className="p-4 border-y border-[var(--input-border)] cursor-pointer hover:bg-[var(--card-background-hover)]"
                  onClick={() => setChartModal({ isOpen: true, stock })}
                >
                  {/* Top Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Placeholder for stock icon */}
                      <div className="w-10 h-10 rounded-full bg-[var(--text-accent-blue)] flex items-center justify-center text-white font-bold text-sm">
                        {stock.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-[var(--text-primary)] font-semibold text-base">{stock.name}</h3>
                        <p className="text-[var(--text-secondary)] text-xs">{stock.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--text-secondary)] text-sm">수량</p>
                      <p className="text-[var(--text-primary)] font-bold text-base">{formatNumber(stock.quantity || 0)}</p>
                    </div>
                  </div>

                  {/* Bottom Two Columns */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {/* Left Column */}
                    <div>
                      <p className="text-[var(--text-secondary)]">자산가치</p>
                      <p className="text-[var(--text-primary)] font-bold">₩{formatCurrencyNoDecimals(holdingValue)}</p>
                      <p className="text-[var(--text-secondary)] mt-2">수익</p>
                      <p className={`font-bold ${profit >= 0 ? 'text-[var(--text-accent-green)]' : 'text-[var(--text-accent-red)]'}`}>
                        {profit >= 0 ? '+' : ''}₩{formatCurrencyNoDecimals(profit)} ({profit >= 0 ? '+' : ''}{formatPercentage(profitPercent, 2)}%)
                      </p>
                    </div>

                    {/* Right Column */}
                    <div className="text-right">
                      <p className="text-[var(--text-secondary)]">구매가</p>
                      <p className="text-[var(--text-primary)] font-bold">₩{formatCurrencyNoDecimals(stock.averagePrice || 0)}</p>
                      <p className="text-[var(--text-secondary)] mt-2">현재가</p>
                      <p className={`font-bold ${stock.change >= 0 ? 'text-[var(--text-accent-green)]' : 'text-[var(--text-accent-red)]'}`}>
                        ₩{formatCurrencyNoDecimals(stock.price)} ({stock.change >= 0 ? '▲' : '▼'}{formatPercentage(stock.changePercent, 2)}%)
                      </p>
                    </div>
                  </div>

                  {/* Portfolio Weight */}
                  <div className="mb-3 mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[var(--text-secondary)] text-xs">포트폴리오 비중</span>
                      <span className="text-[var(--text-accent-blue)] text-xs font-medium">
                        {formatPercentage(portfolioWeight, 1)}%
                      </span>
                    </div>
                    <div className="w-full bg-[var(--input-border)] rounded-full h-1.5 sm:h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{ width: `${portfolioWeight}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 justify-center mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening chart modal
                        setEditModal({ isOpen: true, stock });
                      }}
                      className="px-4 py-2 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] text-[var(--text-primary)] text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      수정
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening chart modal
                        handleDeleteClick(stock);
                      }}
                      className="px-4 py-2 bg-[var(--button-danger-bg)] hover:bg-[var(--button-danger-hover-bg)] text-[var(--text-primary)] text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      삭제
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

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={showConfirmDeleteModal}
        onClose={() => setShowConfirmDeleteModal(false)}
        title="보유 종목 삭제 확인"
      >
        <p className="text-[var(--text-primary)] mb-4">
          <span className="font-bold">{stockToDelete?.name} ({stockToDelete?.symbol})</span> 종목을 정말 삭제하시겠습니까?
          이 작업은 되돌릴 수 없으며, 모든 보유 정보가 사라집니다.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowConfirmDeleteModal(false)}
            className="px-4 py-2 bg-[var(--button-default-bg)] hover:bg-[var(--button-default-hover-bg)] text-[var(--button-default-text)] rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 bg-[var(--button-danger-bg)] hover:bg-[var(--button-danger-hover-bg)] text-[var(--text-primary)] rounded-lg transition-colors"
          >
            삭제
          </button>
        </div>
      </Modal>
    </>
  );
};

export default HoldingsList;