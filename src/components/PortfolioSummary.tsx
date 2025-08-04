import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { formatCurrencyNoDecimals, formatPercentage } from '../utils/formatters';

const PortfolioSummary: React.FC = () => {
  const { getPortfolioSummary } = usePortfolio();
  const portfolio = getPortfolioSummary(); // 이제 이 함수는 메모이제이션된 값을 반환합니다.

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      <div className="glass-card p-4 sm:p-6 glow-effect">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-[var(--text-secondary)] text-xs">총 자산</h3>
          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-accent-blue)]" />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-base sm:text-xl font-bold text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(portfolio.totalValue)}</p>
          {/* 임의의 고정 텍스트 제거 */}
          {/* <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            <span className="text-green-400 text-xs">+2.5% (₩305,000)</span>
          </div> */}
        </div>
      </div>

      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-[var(--text-secondary)] text-xs">오늘 수익</h3>
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-accent-green)]" />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-base sm:text-xl font-bold text-[var(--text-accent-green)]">₩{formatCurrencyNoDecimals(portfolio.todayChange)}</p>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-accent-green)] text-xs">+{formatPercentage(portfolio.todayChangePercent, 2)}%</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-[var(--text-secondary)] text-xs">월간 수익률</h3>
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-accent-red)]" />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-base sm:text-xl font-bold text-[var(--text-accent-red)]">₩{formatCurrencyNoDecimals(portfolio.monthlyChange)}</p>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-accent-red)] text-xs">{formatPercentage(portfolio.monthlyChangePercent, 2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;