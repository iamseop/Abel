import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (symbol: string, name: string) => void;
}

const availableStocks = [
  { symbol: '005930', name: '삼성전자' },
  { symbol: '000660', name: 'SK하이닉스' },
  { symbol: '035420', name: 'NAVER' },
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

const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onAddStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customSymbol, setCustomSymbol] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const filteredStocks = availableStocks.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.includes(searchTerm)
  );

  const handleAddStock = (symbol: string, name: string) => {
    onAddStock(symbol, name);
    setSearchTerm('');
    onClose();
  };

  const handleAddCustomStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymbol.trim() && customName.trim()) {
      onAddStock(customSymbol.trim(), customName.trim());
      setCustomSymbol('');
      setCustomName('');
      setShowCustomForm(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <h2 className="text-xl font-bold text-white mb-6">관심 종목 추가</h2>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowCustomForm(false)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              !showCustomForm
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            종목 검색
          </button>
          <button
            onClick={() => setShowCustomForm(true)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              showCustomForm
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            직접 추가
          </button>
        </div>

        {!showCustomForm ? (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="종목명 또는 코드 검색"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleAddStock(stock.symbol, stock.name)}
                  className="w-full p-4 text-left hover:bg-white/5 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{stock.name}</p>
                      <p className="text-gray-400 text-sm">{stock.symbol}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={handleAddCustomStock} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                종목 코드
              </label>
              <input
                type="text"
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value)}
                placeholder="예: 005930"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                종목명
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="예: 삼성전자"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              종목 추가
            </button>
          </form>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default AddStockModal;