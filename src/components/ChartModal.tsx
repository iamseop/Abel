import React from 'react';
import { X, BarChart3, Plus, ShoppingCart } from 'lucide-react';
import TradingViewWidget from './TradingViewWidget';
import Modal from './Modal'; // Modal 컴포넌트 임포트

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockName: string;
}

const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose, stockSymbol, stockName }) => {
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
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`${stockName} (${stockSymbol})`}
      // contentClassName을 사용하여 내부 콘텐츠 div의 스타일을 오버라이드
      contentClassName="w-full max-w-7xl h-[95vh] flex flex-col bg-[var(--input-background)] rounded-2xl overflow-hidden border border-[var(--card-border)] shadow-2xl"
    >
      {/* 차트 영역 - 완전히 채우기 */}
      <div className="flex-1 bg-gray-900 relative overflow-hidden" style={{ backgroundColor: "#111827" }}>
        {/* 추가 배경 레이어 */}
        <div className="absolute inset-0 bg-gray-900 z-0" style={{ backgroundColor: "#111827" }}></div>
        
        {/* TradingView 위젯 컨테이너 */}
        <div className="relative z-10 w-full h-full bg-gray-900" style={{ backgroundColor: "#111827" }}>
          <TradingViewWidget symbol={tradingViewSymbol} />
        </div>
      </div>

      {/* 모바일용 하단 액션 바 */}
      <div className="sm:hidden p-3 border-t border-white/10 bg-gray-900 flex-shrink-0 relative z-10">
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] text-[var(--text-primary)] text-sm rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            관심종목
          </button>
          <button className="flex-1 py-2 bg-[var(--text-accent-green)] hover:bg-[var(--text-accent-green)] text-[var(--text-primary)] text-sm rounded-lg transition-colors">
            <ShoppingCart className="w-4 h-4" />
            매수
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ChartModal;