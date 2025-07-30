import React, { useState } from 'react';
import { Search, Plus, DollarSign } from 'lucide-react';
import Modal from './Modal';

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHolding: (symbol: string, name: string, quantity: number, averagePrice: number) => void;
}

const availableStocks = [
  { symbol: 'NVDA', name: '엔비디아' },
  { symbol: 'MSFT', name: '마이크로소프트' },
  { symbol: 'BTCUSD', name: '비트코인' },
  { symbol: '035720', name: '카카오' },
  { symbol: '207940', name: '삼성바이오로직스' },
  { symbol: '006400', name: '삼성SDI' },
  { symbol: '051910', name: 'LG화학' },
  { symbol: '028260', name: '삼성물산' },
  { symbol: '068270', name: '셀트리온' },
  { symbol: '015760', name: '한국전력' },
  { symbol: '003550', name: 'LG' },
  { symbol: '017670', name: 'SK텔레콤' },
  { symbol: '030200', name: 'KT' },
  { symbol: '096770', name: 'SK이노베이션' },
  { symbol: '034730', name: 'SK' },
  { symbol: '018260', name: '삼성에스디에스' },
  { symbol: '066570', name: 'LG전자' },
  { symbol: '323410', name: '카카오뱅크' },
  { symbol: '352820', name: '하이브' },
  { symbol: '377300', name: '카카오페이' }
];

const AddHoldingModal: React.FC<AddHoldingModalProps> = ({ isOpen, onClose, onAddHolding }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string } | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [averagePrice, setAveragePrice] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customSymbol, setCustomSymbol] = useState('');
  const [customName, setCustomName] = useState('');

  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue === '') return '';
    return parseInt(numericValue, 10).toLocaleString();
  };

  const parseNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  const filteredStocks = availableStocks.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.includes(searchTerm)
  );

  const handleSelectStock = (stock: { symbol: string; name: string }) => {
    setSelectedStock(stock);
    setSearchTerm('');
    setShowCustomForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalSymbol = '';
    let finalName = '';

    if (showCustomForm) {
      finalSymbol = customSymbol.trim();
      finalName = customName.trim();
    } else if (selectedStock) {
      finalSymbol = selectedStock.symbol;
      finalName = selectedStock.name;
    }

    const numQuantity = parseNumber(quantity);
    const numAveragePrice = parseNumber(averagePrice);

    if (finalSymbol && finalName && numQuantity > 0 && numAveragePrice > 0) {
      onAddHolding(finalSymbol, finalName, numQuantity, numAveragePrice);
      setSelectedStock(null);
      setQuantity('');
      setAveragePrice('');
      setCustomSymbol('');
      setCustomName('');
      onClose();
    } else {
      alert('모든 필수 정보를 입력하고 수량과 평단가는 0보다 커야 합니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="보유 종목 추가">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setShowCustomForm(false); setSelectedStock(null); }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            !showCustomForm
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          종목 검색
        </button>
        <button
          onClick={() => { setShowCustomForm(true); setSelectedStock(null); }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            showCustomForm
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          직접 입력
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!showCustomForm ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="종목명 또는 코드 검색"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            {searchTerm && filteredStocks.length > 0 && (
              <div className="max-h-40 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg">
                {filteredStocks.map((stock) => (
                  <button
                    type="button"
                    key={stock.symbol}
                    onClick={() => handleSelectStock(stock)}
                    className="w-full p-3 text-left hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <p className="text-white font-medium">{stock.name}</p>
                    <p className="text-gray-400 text-xs">{stock.symbol}</p>
                  </button>
                ))}
              </div>
            )}
            {selectedStock && (
              <div className="p-3 bg-gray-700 rounded-lg flex justify-between items-center">
                <span className="text-white font-medium">{selectedStock.name} ({selectedStock.symbol})</span>
                <button type="button" onClick={() => setSelectedStock(null)} className="text-red-400 text-sm">
                  선택 취소
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                종목 코드
              </label>
              <input
                type="text"
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value)}
                placeholder="예: AAPL"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                required={showCustomForm}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                종목명
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="예: 애플"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                required={showCustomForm}
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-2">
            수량
          </label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(formatNumber(e.target.value))}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            placeholder="0"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-2">
            평단가 (원)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={averagePrice}
              onChange={(e) => setAveragePrice(formatNumber(e.target.value))}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="0"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!(selectedStock || (showCustomForm && customSymbol && customName)) || !quantity || !averagePrice || parseNumber(quantity) <= 0 || parseNumber(averagePrice) <= 0}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          보유 종목 추가
        </button>
      </form>
    </Modal>
  );
};

export default AddHoldingModal;