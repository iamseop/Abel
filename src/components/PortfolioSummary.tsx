import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

const PortfolioSummary: React.FC = () => {
  const { getPortfolioSummary } = usePortfolio();
  const portfolio = getPortfolioSummary();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="glass-card p-4 sm:p-6 glow-effect">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-300 text-xs sm:text-sm">총 자산</h3>
          <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-lg sm:text-2xl font-bold text-white">₩{portfolio.totalValue.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            <span className="text-green-400 text-xs sm:text-sm">+2.5% (₩305,000)</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-300 text-xs sm:text-sm">오늘 수익</h3>
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-lg sm:text-2xl font-bold text-green-400">₩{portfolio.todayChange.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-xs sm:text-sm">+{portfolio.todayChangePercent}%</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-gray-300 text-xs sm:text-sm">월간 수익률</h3>
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-lg sm:text-2xl font-bold text-red-400">₩{portfolio.monthlyChange.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-xs sm:text-sm">{portfolio.monthlyChangePercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;