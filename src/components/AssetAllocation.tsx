import React, { useState } from 'react';
import { PieChart } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

const AssetAllocation: React.FC = () => {
  const { getAssets } = usePortfolio();
  const assets = getAssets();
  const [hoveredAsset, setHoveredAsset] = useState<string | null>(null);

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="glass-card p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
        <h2 className="text-lg sm:text-xl font-bold text-white">자산 분배</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          {assets.map((asset, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                hoveredAsset === asset.name 
                  ? 'bg-white/10 scale-105' 
                  : 'hover:bg-white/5'
              }`}
              onMouseEnter={() => setHoveredAsset(asset.name)}
              onMouseLeave={() => setHoveredAsset(null)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${asset.color}`}></div>
                <div>
                  <span className="text-white font-medium text-sm sm:text-base">{asset.name}</span>
                  <p className="text-gray-400 text-xs sm:text-sm">{asset.quantity}주</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold text-sm sm:text-base">₩{asset.value.toLocaleString()}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{asset.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              {assets.map((asset, index) => {
                const offset = assets.slice(0, index).reduce((sum, a) => sum + a.percentage, 0);
                const circumference = 2 * Math.PI * 40;
                const strokeDasharray = `${(asset.percentage / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((offset / 100) * circumference);
                
                const colorMap: { [key: string]: string } = {
                  'bg-blue-500': '#3b82f6',
                  'bg-purple-500': '#8b5cf6',
                  'bg-green-500': '#10b981',
                  'bg-yellow-500': '#f59e0b',
                  'bg-gray-500': '#6b7280',
                  'bg-pink-500': '#ec4899',
                  'bg-indigo-500': '#6366f1',
                  'bg-red-500': '#ef4444',
                  'bg-cyan-500': '#06b6d4',
                  'bg-orange-500': '#f97316',
                  'bg-teal-500': '#14b8a6',
                  'bg-lime-500': '#84cc16'
                };
                
                return (
                  <circle
                    key={index}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={colorMap[asset.color] || '#6b7280'}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className={`transition-all duration-300 cursor-pointer ${
                      hoveredAsset === asset.name ? 'opacity-100' : 'opacity-80'
                    }`}
                    style={{
                      filter: hoveredAsset === asset.name ? 'brightness(1.2)' : 'none',
                      strokeWidth: hoveredAsset === asset.name ? '10' : '8'
                    }}
                    onMouseEnter={() => setHoveredAsset(asset.name)}
                    onMouseLeave={() => setHoveredAsset(null)}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                {hoveredAsset ? (
                  <>
                    <p className="text-sm sm:text-lg font-bold text-white">{hoveredAsset}</p>
                    <p className="text-blue-400 text-xs sm:text-sm">
                      {assets.find(a => a.name === hoveredAsset)?.percentage.toFixed(1)}%
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg sm:text-2xl font-bold text-white">₩{(totalValue / 1000000).toFixed(1)}M</p>
                    <p className="text-gray-400 text-xs sm:text-sm">총 자산</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;