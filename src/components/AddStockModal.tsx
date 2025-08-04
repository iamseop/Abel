import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, DollarSign } from 'lucide-react';
import Modal from './Modal';
import { supabase } from '../integrations/supabase/client';
import { showError } from '../utils/toast';
import { cleanNumericInput, formatNumber, parseNumber } from '../utils/formatters';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (symbol: string, name: string, coingeckoId?: string) => void; // coingeckoId 추가
}

const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onAddStock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customSymbol, setCustomSymbol] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 검색어 변경 시 CoinGecko API 호출
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('search-coingecko-tickers', {
          body: { query: searchTerm.trim() },
        });

        if (error) {
          console.error('Error searching CoinGecko tickers:', error);
          showError('코인 검색에 실패했습니다.');
          setSearchResults([]);
        } else {
          // CoinGecko 검색 결과는 id, symbol, name, market_cap_rank 등을 포함
          setSearchResults(data || []);
        }
      } catch (err) {
        console.error('Unexpected error during CoinGecko search:', err);
        showError('코인 검색 중 예상치 못한 오류가 발생했습니다.');
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms 디바운스
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleAddStock = (symbol: string, name: string, coingeckoId?: string) => {
    onAddStock(symbol, name, coingeckoId);
    setSearchTerm('');
    setSearchResults([]);
    onClose();
  };

  const handleAddCustomStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSymbol.trim() && customName.trim()) {
      // 직접 추가 시에는 coingeckoId가 없으므로 undefined 전달
      onAddStock(customSymbol.trim(), customName.trim(), undefined); 
      setCustomSymbol('');
      setCustomName('');
      setShowCustomForm(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="관심 종목 추가" contentClassName="max-w-md">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowCustomForm(false)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            !showCustomForm
              ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)]'
              : 'bg-[var(--button-default-bg)] text-[var(--text-tertiary)] hover:bg-[var(--button-default-hover-bg)]'
          }`}
        >
          종목 검색
        </button>
        <button
          onClick={() => setShowCustomForm(true)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            showCustomForm
              ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)]'
              : 'bg-[var(--button-default-bg)] text-[var(--text-tertiary)] hover:bg-[var(--button-default-hover-bg)]'
          }`}
        >
          직접 추가
        </button>
      </div>

      {!showCustomForm ? (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="종목명 또는 코드 검색"
              className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              required
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="text-center text-[var(--text-secondary)] py-4">검색 중...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((stock) => (
                <button
                  type="button"
                  key={stock.id} // CoinGecko ID를 key로 사용
                  onClick={() => handleAddStock(stock.symbol, stock.name, stock.id)} // coingeckoId 전달
                  className="w-full p-4 text-left hover:bg-[var(--card-background-hover)] rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[var(--text-primary)] font-medium">{stock.name}</p>
                      <p className="text-[var(--text-secondary)] text-xs">{stock.symbol} {stock.market_cap_rank ? `(Rank: ${stock.market_cap_rank})` : ''}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : searchTerm.trim() !== '' ? (
              <div className="text-center text-[var(--text-secondary)] py-4">검색 결과가 없습니다.</div>
            ) : (
              <div className="text-center text-[var(--text-secondary)] py-4">종목을 검색해주세요.</div>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleAddCustomStock} className="space-y-4">
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
              required
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
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] text-[var(--text-primary)] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            종목 추가
          </button>
        </form>
      )}
    </Modal>
  );
};

export default AddStockModal;