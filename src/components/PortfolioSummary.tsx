import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

const PortfolioSummary: React.FC = () => {
  const { getPortfolioSummary } = usePortfolio();
  const portfolio = getPortfolioSummary();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="glass-card p-6 glow-effect">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 text-sm">총 자산</h3>
          <DollarSign className="w-5 h-5 text-blue-400" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-white">₩{portfolio.totalValue.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+2.5% (₩305,000)</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 text-sm">오늘 수익</h3>
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-green-400">₩{portfolio.todayChange.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm">+{portfolio.todayChangePercent}%</span>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 text-sm">월간 수익률</h3>
          <TrendingDown className="w-5 h-5 text-red-400" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-red-400">₩{portfolio.monthlyChange.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <span className="text-red-400 text-sm">{portfolio.monthlyChangePercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;