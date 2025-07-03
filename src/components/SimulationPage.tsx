import React, { useState } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3, Target, Award, AlertCircle } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

interface SimulationPortfolio {
  id: string;
  name: string;
  initialAmount: number;
  currentValue: number;
  totalReturn: number;
  returnPercent: number;
  holdings: {
    symbol: string;
    name: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    value: number;
    returnPercent: number;
  }[];
  createdAt: Date;
}

const SimulationPage: React.FC = () => {
  const { stocks } = usePortfolio();
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'ranking'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 모의 데이터
  const simulationPortfolios: SimulationPortfolio[] = [
    {
      id: '1',
      name: '성장주 포트폴리오',
      initialAmount: 10000000,
      currentValue: 11250000,
      totalReturn: 1250000,
      returnPercent: 12.5,
      holdings: [
        {
          symbol: '005930',
          name: '삼성전자',
          quantity: 50,
          avgPrice: 68000,
          currentPrice: 71000,
          value: 3550000,
          returnPercent: 4.41
        },
        {
          symbol: '035420',
          name: 'NAVER',
          quantity: 20,
          avgPrice: 180000,
          currentPrice: 185000,
          value: 3700000,
          returnPercent: 2.78
        }
      ],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      name: '안정형 포트폴리오',
      initialAmount: 5000000,
      currentValue: 5150000,
      totalReturn: 150000,
      returnPercent: 3.0,
      holdings: [
        {
          symbol: '000660',
          name: 'SK하이닉스',
          quantity: 30,
          avgPrice: 85000,
          currentPrice: 89500,
          value: 2685000,
          returnPercent: 5.29
        }
      ],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    }
  ];

  const totalInvested = simulationPortfolios.reduce((sum, p) => sum + p.initialAmount, 0);
  const totalCurrent = simulationPortfolios.reduce((sum, p) => sum + p.currentValue, 0);
  const totalReturn = totalCurrent - totalInvested;
  const totalReturnPercent = (totalReturn / totalInvested) * 100;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* 전체 성과 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-blue-400" />
            <h3 className="text-gray-300 text-sm">총 투자금</h3>
          </div>
          <p className="text-2xl font-bold text-white">₩{totalInvested.toLocaleString()}</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-6 h-6 text-green-400" />
            <h3 className="text-gray-300 text-sm">현재 가치</h3>
          </div>
          <p className="text-2xl font-bold text-white">₩{totalCurrent.toLocaleString()}</p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h3 className="text-gray-300 text-sm">총 수익</h3>
          </div>
          <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalReturn >= 0 ? '+' : ''}₩{totalReturn.toLocaleString()}
          </p>
        </div>
        
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-yellow-400" />
            <h3 className="text-gray-300 text-sm">수익률</h3>
          </div>
          <p className={`text-2xl font-bold ${totalReturnPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalReturnPercent >= 0 ? '+' : ''}{totalReturnPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* 포트폴리오 목록 */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">내 모의투자 포트폴리오</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            새 포트폴리오 만들기
          </button>
        </div>

        <div className="space-y-4">
          {simulationPortfolios.map((portfolio) => (
            <div key={portfolio.id} className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-lg">{portfolio.name}</h3>
                <span className="text-gray-400 text-sm">
                  {portfolio.createdAt.toLocaleDateString()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">투자금</p>
                  <p className="text-white font-semibold">₩{portfolio.initialAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">현재 가치</p>
                  <p className="text-white font-semibold">₩{portfolio.currentValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">수익</p>
                  <p className={`font-semibold ${portfolio.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolio.totalReturn >= 0 ? '+' : ''}₩{portfolio.totalReturn.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">수익률</p>
                  <p className={`font-semibold ${portfolio.returnPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {portfolio.returnPercent >= 0 ? '+' : ''}{portfolio.returnPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-6">포트폴리오 상세</h2>
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <p className="text-yellow-400 font-medium">개발 중인 기능입니다</p>
        </div>
        <p className="text-gray-300 text-sm mt-2">
          상세한 포트폴리오 관리 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );

  const renderRanking = () => (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-6">모의투자 랭킹</h2>
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <p className="text-yellow-400 font-medium">개발 중인 기능입니다</p>
        </div>
        <p className="text-gray-300 text-sm mt-2">
          다른 사용자들과의 수익률 비교 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h1 className="text-2xl font-bold text-white">모의투자</h1>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          개요
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'portfolio'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          포트폴리오 관리
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'ranking'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
        >
          랭킹
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'portfolio' && renderPortfolio()}
      {activeTab === 'ranking' && renderRanking()}

      {/* 모의투자 안내 */}
      <div className="glass-card p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <h3 className="text-white font-bold text-lg mb-4">💡 모의투자란?</h3>
        <div className="space-y-2 text-gray-300">
          <p>• 실제 돈을 사용하지 않고 가상의 자금으로 투자를 체험할 수 있습니다</p>
          <p>• 실시간 주가 데이터를 바탕으로 실제와 동일한 환경에서 투자 연습이 가능합니다</p>
          <p>• 다양한 투자 전략을 시험해보고 위험 없이 경험을 쌓을 수 있습니다</p>
          <p>• 다른 사용자들과 수익률을 비교하며 실력을 향상시킬 수 있습니다</p>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;