import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, DollarSign } from 'lucide-react';
import Modal from './Modal';
import { supabase } from '../integrations/supabase/client';
import { showError } from '../utils/toast';
import { cleanNumericInput, formatNumber, parseNumber } from '../utils/formatters';

// 임시 더미 데이터 (실제 API가 작동하지 않을 때 사용)
const dummyStocks = [
  { symbol: 'NVDA', name: '엔비디아', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: '마이크로소프트', exchange: 'NASDAQ' },
  { symbol: 'BTCUSD', name: '비트코인', exchange: 'CRYPTO' },
  { symbol: '035720', name: '카카오', exchange: 'KRX' },
  { symbol: '207940', name: '삼성바이오로직스', exchange: 'KRX' },
  { symbol: '006400', name: '삼성SDI', exchange: 'KRX' },
  { symbol: '051910', name: 'LG화학', exchange: 'KRX' },
  { symbol: '028260', name: '삼성물산', exchange: 'KRX' },
  { symbol: '068270', name: '셀트리온', exchange: 'KRX' },
  { symbol: '015760', name: '한국전력', exchange: 'KRX' },
];

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHolding: (symbol: string, name: string, quantity: number, averagePrice: number) => void;
}

const AddHoldingModal: React.FC<AddHoldingModalProps> = ({ isOpen, onClose, onAddHolding }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string; exchange?: string } | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [averagePrice, setAveragePrice] = useState<string>('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customSymbol, setCustomSymbol] = useState('');
  const [customName, setCustomName] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 검색어 변경 시 더미 데이터 필터링
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    // 디바운싱 적용: 300ms 후에 검색 실행
    debounceTimeoutRef.current = setTimeout(async () => {
      // 실제 API 호출 대신 더미 데이터 필터링
      const filtered = dummyStocks.filter(stock =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
      setIsLoading(false);
    }, 300); // 300ms 디바운스
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleSelectStock = (stock: { symbol: string; name: string; exchange?: string }) => {
    setSelectedStock(stock);
    setSearchTerm('');
    setSearchResults([]);
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
    <Modal isOpen={isOpen} onClose={onClose} title="보유 종목 추가" contentClassName="max-w-md">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setShowCustomForm(false); setSelectedStock(null); }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            !showCustomForm
              ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)]'
              : 'bg-[var(--button-default-bg)] text-[var(--text-tertiary)] hover:bg-[var(--button-default-hover-bg)]'
          }`}
        >
          종목 검색
        </button>
        <button
          onClick={() => { setShowCustomForm(true); setSelectedStock(null); }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            showCustomForm
              ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)]'
              : 'bg-[var(--button-default-bg)] text-[var(--text-tertiary)] hover:bg-[var(--button-default-hover-bg)]'
          }`}
        >
          직접 입력
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!showCustomForm ? (
          <React.Fragment>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="종목명 또는 코드 검색"
                className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                required={!showCustomForm && !selectedStock}
              />
            </div>
              {searchTerm.trim() !== '' && (
                <div className="max-h-40 overflow-y-auto bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg">
                  {isLoading ? (
                    <div className="text-center text-[var(--text-secondary)] py-4">검색 중...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((stock) => (
                      <button
                        type="button"
                        key={stock.symbol}
                        onClick={() => handleSelectStock(stock)}
                        className="w-full p-3 text-left hover:bg-[var(--card-background-hover)] rounded-lg transition-colors"
                      >
                        <p className="text-[var(--text-primary)] font-medium">{stock.name}</p>
                        <p className="text-[var(--text-secondary)] text-xs">{stock.symbol} ({stock.exchange})</p>
                      </button>
                    ))
                  ) : searchTerm.trim() !== '' ? (
                    <div className="text-center text-[var(--text-secondary)] py-4">검색 결과가 없습니다.</div>
                  ) : (
                    <div className="text-center text-[var(--text-secondary)] py-4">종목을 검색해주세요.</div>
                  )}
                </div>
              )}
            {selectedStock && (
              <div className="p-3 bg-[var(--button-default-bg)] rounded-lg flex justify-between items-center">
                <span className="text-[var(--text-primary)] font-medium">{selectedStock.name} ({selectedStock.symbol})</span>
                <button type="button" onClick={() => setSelectedStock(null)} className="text-[var(--text-accent-red)] text-sm">
                  선택 취소
                </button>
              </div>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                종목 코드
              </label>
              <input
                type="text"
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value)}
                placeholder="예: AAPL"
                className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                required={showCustomForm}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                종목명
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="예: 애플"
                className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                required={showCustomForm}
              />
            </div>
          </React.Fragment>
        )}

          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              수량
            </label>
            <input
              type="text"
              value={formatNumber(quantity)} // 쉼표 추가하여 표시
              onChange={(e) => setQuantity(cleanNumericInput(e.target.value))}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              평단가 (원)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={formatNumber(averagePrice)} // 쉼표 추가하여 표시
                onChange={(e) => setAveragePrice(cleanNumericInput(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                placeholder="0"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!(selectedStock || (showCustomForm && customSymbol && customName)) || !quantity || !averagePrice || parseNumber(quantity) <= 0 || parseNumber(averagePrice) <= 0}
            className="w-full py-3 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] disabled:bg-[var(--button-default-bg)] disabled:text-[var(--text-secondary)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            보유 종목 추가
          </button>
        </form>
    </Modal>
  );
};

export default AddHoldingModal;