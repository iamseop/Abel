import React, { useState, useEffect } from 'react';
import { Edit3, Plus, Minus, Save, X } from 'lucide-react';
import { cleanNumericInput, formatNumber, formatCurrencyNoDecimals, parseNumber } from '../utils/formatters';
import Modal from './Modal'; // Modal 컴포넌트 임포트

interface EditHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: any;
  onUpdate: (symbol: string, quantity: number, averagePrice: number, name: string) => void;
  onTrade: (type: 'buy' | 'sell', assetName: string, amount: number, price: number, symbol: string) => void;
}

const EditHoldingModal: React.FC<EditHoldingModalProps> = ({ 
  isOpen, 
  onClose, 
  stock, 
  onUpdate,
  onTrade 
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'trade'>('edit');
  const [quantity, setQuantity] = useState<string>('');
  const [averagePrice, setAveragePrice] = useState<string>('');
  const [stockName, setStockName] = useState<string>('');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeQuantity, setTradeQuantity] = useState<string>('');
  const [tradePrice, setTradePrice] = useState<string>('');

  useEffect(() => {
    if (stock) {
      setQuantity(formatNumber(stock.quantity || 0));
      setAveragePrice(formatNumber(stock.averagePrice || 0));
      setStockName(stock.name || '');
      setTradePrice(formatNumber(stock.price || 0));
    }
  }, [stock]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(cleanNumericInput(e.target.value));
  };

  const handleAveragePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAveragePrice(cleanNumericInput(e.target.value));
  };

  const handleStockNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStockName(e.target.value);
  };

  const handleTradePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTradePrice(cleanNumericInput(e.target.value));
  };

  const handleTradeQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTradeQuantity(cleanNumericInput(e.target.value));
  };

  const handleSaveEdit = () => {
    const newQuantity = parseNumber(quantity);
    const newAveragePrice = parseNumber(averagePrice);
    
    if (newQuantity < 0) {
      alert('수량은 0보다 작을 수 없습니다.');
      return;
    }

    if (newQuantity > 0 && newAveragePrice <= 0) {
      alert('보유 수량이 0보다 클 경우 평단가는 0보다 커야 합니다.');
      return;
    }

    onUpdate(stock.symbol, newQuantity, newAveragePrice, stockName);
    onClose();
  };

  const handleTradeSubmit = () => {
    const amount = parseNumber(tradeQuantity);
    const price = parseNumber(tradePrice);
    
    if (amount > 0 && price > 0) {
      if (tradeType === 'sell' && amount > (stock.quantity || 0)) {
        alert('보유 수량보다 많이 매도할 수 없습니다.');
        return;
      }
      
      onTrade(tradeType, stock.name, amount, price, stock.symbol);
      setTradeQuantity('');
      onClose();
    }
  };

  const calculateNewAverage = () => {
    if (tradeType === 'buy' && tradeQuantity && tradePrice) {
      const currentQuantity = stock.quantity || 0;
      const currentAverage = stock.averagePrice || 0;
      const newQuantity = parseNumber(tradeQuantity);
      const newPrice = parseNumber(tradePrice);
      
      const totalValue = (currentQuantity * currentAverage) + (newQuantity * newPrice);
      const totalQuantity = currentQuantity + newQuantity;
      
      return totalQuantity > 0 ? totalValue / totalQuantity : 0;
    }
    return stock.averagePrice || 0;
  };

  if (!isOpen || !stock) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${stock.name} (${stock.symbol})`} contentClassName="max-w-lg">
      {/* 현재 정보 */}
      <div className="bg-[var(--input-background)] p-4 rounded-lg mb-6">
        <h3 className="text-[var(--text-primary)] font-semibold mb-3">현재 보유 정보</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[var(--text-secondary)] text-xs">현재가</p>
            <p className="text-[var(--text-primary)] font-semibold">₩{formatNumber(stock.price || 0)}</p>
          </div>
          <div>
            <p className="text-[var(--text-secondary)] text-xs">보유 수량</p>
            <p className="text-[var(--text-primary)] font-semibold">{formatNumber(stock.quantity || 0)}주</p>
          </div>
          <div>
            <p className="text-[var(--text-secondary)] text-xs">평단가</p>
            <p className="text-[var(--text-primary)] font-semibold">₩{formatNumber(stock.averagePrice || 0)}</p>
          </div>
          <div>
            <p className="text-[var(--text-secondary)] text-xs">보유 가치</p>
            <p className="text-[var(--text-primary)] font-semibold">₩{formatCurrencyNoDecimals((stock.quantity || 0) * (stock.price || 0))}</p>
          </div>
        </div>
      </div>

      {/* 탭 선택 */}
      <div className="flex bg-[var(--input-background)] rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'edit'
              ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          직접 수정
        </button>
        <button
          onClick={() => setActiveTab('trade')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'trade'
              ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)]'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Plus className="w-4 h-4" />
          매매하기
        </button>
      </div>

      {/* 직접 수정 탭 */}
      {activeTab === 'edit' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              종목명
            </label>
            <input
              type="text"
              value={stockName}
              onChange={handleStockNameChange}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="종목명 입력"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              수량
            </label>
            <input
              type="text"
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              평단가
            </label>
            <input
              type="text"
              value={averagePrice}
              onChange={handleAveragePriceChange}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus- GITHUB_API_KEY)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="0"
            />
          </div>

          <div className="bg-[var(--input-background)] p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-tertiary)]">수정 후 보유 가치</span>
              <span className="text-[var(--text-primary)] font-bold">
                ₩{formatCurrencyNoDecimals(parseNumber(quantity) * parseNumber(averagePrice))}
              </span>
            </div>
          </div>

          <button
            onClick={handleSaveEdit}
            disabled={!quantity || (parseNumber(quantity) > 0 && !averagePrice) || !stockName.trim()}
            className="w-full py-3 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] disabled:bg-[var(--button-default-bg)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            저장하기
          </button>
        </div>
      )}

      {/* 매매하기 탭 */}
      {activeTab === 'trade' && (
        <div className="space-y-4">
          <div className="flex bg-[var(--input-background)] rounded-lg p-1">
            <button
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                tradeType === 'buy'
                  ? 'bg-[var(--text-accent-green)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              매수
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                tradeType === 'sell'
                  ? 'bg-[var(--text-accent-red)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              매도
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              {tradeType === 'buy' ? '매수' : '매도'} 가격
            </label>
            <input
              type="text"
              value={tradePrice}
              onChange={handleTradePriceChange}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              {tradeType === 'buy' ? '매수' : '매도'} 수량
              {tradeType === 'sell' && (
                <span className="text-[var(--text-secondary)] ml-2">(보유: {formatNumber(stock.quantity || 0)}주)</span>
              )}
            </label>
            <input
              type="text"
              value={tradeQuantity}
              onChange={handleTradeQuantityChange}
              max={tradeType === 'sell' ? stock.quantity : undefined}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="0"
            />
          </div>

          <div className="bg-[var(--input-background)] p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-tertiary)]">거래 금액</span>
              <span className="text-[var(--text-primary)] font-bold">
                ₩{formatCurrencyNoDecimals(parseNumber(tradeQuantity) * parseNumber(tradePrice))}
              </span>
            </div>
            {tradeType === 'buy' && tradeQuantity && tradePrice && (
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-tertiary)]">예상 평단가</span>
                <span className="text-[var(--text-accent-blue)] font-semibold">
                  ₩{formatNumber(calculateNewAverage())}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleTradeSubmit}
            disabled={!tradeQuantity || !tradePrice || (tradeType === 'sell' && parseNumber(tradeQuantity) > (stock.quantity || 0))}
            className={`w-full py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              tradeType === 'buy'
                ? 'bg-[var(--text-accent-green)] hover:bg-[var(--text-accent-green)] text-[var(--text-primary)]'
                : 'bg-[var(--button-danger-bg)] hover:bg-[var(--button-danger-hover-bg)] text-[var(--text-primary)]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {tradeType === 'buy' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
            {tradeType === 'buy' ? '매수하기' : '매도하기'}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default EditHoldingModal;