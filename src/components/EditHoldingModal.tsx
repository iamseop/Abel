import React, { useState, useEffect } from 'react';
import { Edit3, Plus, Minus, Save, X } from 'lucide-react';

interface EditHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: any;
  onUpdate: (symbol: string, quantity: number, averagePrice: number) => void;
  onTrade: (type: 'buy' | 'sell', asset: string, amount: number, price: number) => void;
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
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeQuantity, setTradeQuantity] = useState<string>('');
  const [tradePrice, setTradePrice] = useState<string>('');

  useEffect(() => {
    if (stock) {
      setQuantity(stock.quantity?.toString() || '0');
      setAveragePrice(stock.averagePrice?.toString() || '0');
      setTradePrice(stock.price?.toString() || '0');
    }
  }, [stock]);

  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setQuantity(value);
  };

  const handleAveragePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setAveragePrice(formatted);
  };

  const handleTradePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setTradePrice(formatted);
  };

  const handleTradeQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setTradeQuantity(value);
  };

  const handleSaveEdit = () => {
    const newQuantity = parseInt(quantity) || 0;
    const newAveragePrice = parseNumber(averagePrice);
    
    if (newQuantity >= 0 && newAveragePrice > 0) {
      onUpdate(stock.symbol, newQuantity, newAveragePrice);
      onClose();
    }
  };

  const handleTrade = () => {
    const amount = parseInt(tradeQuantity) || 0;
    const price = parseNumber(tradePrice);
    
    if (amount > 0 && price > 0) {
      if (tradeType === 'sell' && amount > (stock.quantity || 0)) {
        alert('보유 수량보다 많이 매도할 수 없습니다.');
        return;
      }
      
      onTrade(tradeType, stock.name, amount, price);
      setTradeQuantity('');
      onClose();
    }
  };

  const calculateNewAverage = () => {
    if (tradeType === 'buy' && tradeQuantity && tradePrice) {
      const currentQuantity = stock.quantity || 0;
      const currentAverage = stock.averagePrice || 0;
      const newQuantity = parseInt(tradeQuantity);
      const newPrice = parseNumber(tradePrice);
      
      const totalValue = (currentQuantity * currentAverage) + (newQuantity * newPrice);
      const totalQuantity = currentQuantity + newQuantity;
      
      return totalQuantity > 0 ? totalValue / totalQuantity : 0;
    }
    return stock.averagePrice || 0;
  };

  if (!isOpen || !stock) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">{stock.name}</h2>
            <p className="text-gray-400 text-sm">{stock.symbol}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* 현재 정보 */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-white font-semibold mb-3">현재 보유 정보</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">현재가</p>
              <p className="text-white font-semibold">₩{stock.price?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">보유 수량</p>
              <p className="text-white font-semibold">{stock.quantity}주</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">평단가</p>
              <p className="text-white font-semibold">₩{stock.averagePrice?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">보유 가치</p>
              <p className="text-white font-semibold">₩{((stock.quantity || 0) * (stock.price || 0)).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 탭 선택 */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'edit'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            직접 수정
          </button>
          <button
            onClick={() => setActiveTab('trade')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'trade'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                보유 수량 (주)
              </label>
              <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                평단가 (원)
              </label>
              <input
                type="text"
                value={averagePrice}
                onChange={handleAveragePriceChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">수정 후 보유 가치</span>
                <span className="text-white font-bold">
                  ₩{(parseInt(quantity || '0') * parseNumber(averagePrice)).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveEdit}
              disabled={!quantity || !averagePrice}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              저장하기
            </button>
          </div>
        )}

        {/* 매매하기 탭 */}
        {activeTab === 'trade' && (
          <div className="space-y-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {tradeType === 'buy' ? '매수' : '매도'} 가격 (원)
              </label>
              <input
                type="text"
                value={tradePrice}
                onChange={handleTradePriceChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {tradeType === 'buy' ? '매수' : '매도'} 수량 (주)
                {tradeType === 'sell' && (
                  <span className="text-gray-400 ml-2">(보유: {stock.quantity}주)</span>
                )}
              </label>
              <input
                type="text"
                value={tradeQuantity}
                onChange={handleTradeQuantityChange}
                max={tradeType === 'sell' ? stock.quantity : undefined}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div className="bg-gray-800 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">거래 금액</span>
                <span className="text-white font-bold">
                  ₩{(parseInt(tradeQuantity || '0') * parseNumber(tradePrice)).toLocaleString()}
                </span>
              </div>
              {tradeType === 'buy' && tradeQuantity && tradePrice && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">예상 평단가</span>
                  <span className="text-blue-400 font-semibold">
                    ₩{calculateNewAverage().toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleTrade}
              disabled={!tradeQuantity || !tradePrice || (tradeType === 'sell' && parseInt(tradeQuantity) > (stock.quantity || 0))}
              className={`w-full py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                tradeType === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {tradeType === 'buy' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              {tradeType === 'buy' ? '매수하기' : '매도하기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditHoldingModal;