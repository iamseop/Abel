import React from 'react';
import { X, BarChart3 } from 'lucide-react';
import TradingViewWidget from './TradingViewWidget';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockName: string;
}

const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose, stockSymbol, stockName }) => {
  if (!isOpen) return null;

  // 한국 주식 심볼을 트레이딩뷰 형식으로 변환
  const getTradingViewSymbol = (symbol: string) => {
    // 한국 주식의 경우 KRX: 접두사 추가
    if (symbol.match(/^\d{6}$/)) {
      return `KRX:${symbol}`;
    }
    // 기타 경우는 그대로 사용
    return symbol;
  };

  const tradingViewSymbol = getTradingViewSymbol(stockSymbol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-6xl h-[80vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-bold text-white">{stockName}</h2>
              <p className="text-gray-400 text-sm">{stockSymbol}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {/* 차트 영역 */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
            <TradingViewWidget symbol={tradingViewSymbol} />
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-4 sm:p-6 border-t border-white/10">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              닫기
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              관심종목 추가
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              매수 주문
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartModal;