import React, { useState } from 'react';
import { Plus, Minus, BarChart3, PieChart, TrendingUp, Settings } from 'lucide-react';
import Modal from './Modal';

const QuickActions: React.FC = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const actions = [
    { 
      icon: Plus, 
      label: '매수', 
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => alert('매수 기능은 관심 종목에서 이용하세요')
    },
    { 
      icon: Minus, 
      label: '매도', 
      color: 'bg-red-600 hover:bg-red-700',
      onClick: () => alert('매도 기능은 관심 종목에서 이용하세요')
    },
    { 
      icon: BarChart3, 
      label: '분석', 
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => setShowAnalysis(true)
    },
    { 
      icon: PieChart, 
      label: '리포트', 
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => setShowReport(true)
    },
    { 
      icon: TrendingUp, 
      label: '추천', 
      color: 'bg-yellow-600 hover:bg-yellow-700',
      onClick: () => setShowRecommendations(true)
    },
    { 
      icon: Settings, 
      label: '설정', 
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => alert('설정은 헤더에서 이용하세요')
    }
  ];

  return (
    <>
      <div className="glass-card p-4 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">빠른 실행</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {actions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`${action.color} p-3 sm:p-4 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95`}
              >
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <span className="text-white font-medium text-xs sm:text-sm">{action.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        title="포트폴리오 분석"
      >
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">위험도 분석</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-yellow-500 text-sm">중간</span>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">다각화 점수</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-green-500 text-sm">양호</span>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">수익률 전망</h3>
            <p className="text-green-400">연 8-12% 예상</p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        title="월간 리포트"
      >
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">이번 달 성과</h3>
            <p className="text-red-400">-0.71% (₩89,340)</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">최고 수익 종목</h3>
            <p className="text-green-400">삼성전자 (+5.2%)</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">거래 횟수</h3>
            <p className="text-white">총 12회 (매수 7회, 매도 5회)</p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        title="AI 추천"
      >
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-green-400 font-semibold mb-2">매수 추천</h3>
            <p className="text-white">LG화학</p>
            <p className="text-gray-400 text-sm">배터리 산업 성장 전망</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-2">관심 종목</h3>
            <p className="text-white">삼성바이오로직스</p>
            <p className="text-gray-400 text-sm">바이오 섹터 회복 신호</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-red-400 font-semibold mb-2">리밸런싱 제안</h3>
            <p className="text-white">IT 비중 축소 고려</p>
            <p className="text-gray-400 text-sm">포트폴리오 집중도 완화</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuickActions;