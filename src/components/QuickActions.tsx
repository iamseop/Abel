import React, { useState } from 'react';
import { Plus, Minus, BarChart3, PieChart, TrendingUp, Settings, AlertCircle } from 'lucide-react';
import Modal from './Modal';

const QuickActions: React.FC = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const actions = [
    { 
      icon: Plus, 
      label: '매수', 
      color: 'bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)]',
      onClick: () => alert('매수 기능은 관심 종목에서 이용하세요')
    },
    { 
      icon: Minus, 
      label: '매도', 
      color: 'bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)]',
      onClick: () => alert('매도 기능은 관심 종목에서 이용하세요')
    },
    { 
      icon: BarChart3, 
      label: '분석', 
      color: 'bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)]',
      onClick: () => setShowAnalysis(true)
    },
    { 
      icon: PieChart, 
      label: '리포트', 
      color: 'bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)]',
      onClick: () => setShowReport(true)
    },
    { 
      icon: TrendingUp, 
      label: '추천', 
      color: 'bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)]',
      onClick: () => setShowRecommendations(true)
    },
    { 
      icon: Settings, 
      label: '설정', 
      color: 'bg-[var(--button-default-bg)] hover:bg-[var(--button-default-hover-bg)]',
      onClick: () => alert('설정은 헤더에서 이용하세요')
    }
  ];

  return (
    <>
      <div className="glass-card p-4 sm:p-6 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-4 sm:mb-6">빠른 실행</h2>
        
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
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-primary)]" />
                  <span className="text-[var(--text-primary)] font-medium text-xs">{action.label}</span>
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
        <div className="space-y-3">
          <div className="bg-[var(--input-background)] p-4 rounded-lg">
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">위험도 분석</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--input-border)] rounded-full h-2">
                <div className="bg-[var(--text-accent-yellow)] h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-[var(--text-accent-yellow)] text-sm">중간</span>
            </div>
          </div>
          <div className="bg-[var(--input-background)] p-4 rounded-lg">
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">다각화 점수</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--input-border)] rounded-full h-2">
                <div className="bg-[var(--text-accent-green)] h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-[var(--text-accent-green)] text-sm">양호</span>
            </div>
          </div>
          <div className="bg-[var(--input-background)] p-4 rounded-lg">
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">수익률 전망</h3>
            <p className="text-[var(--text-accent-green)]">연 8-12% 예상</p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        title="월간 리포트"
      >
        <div className="space-y-3">
          <div className="bg-[var(--input-background)] p-4 rounded-lg">
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">이번 달 성과</h3>
            <p className="text-[var(--text-accent-red)]">-0.71% (₩89,340)</p>
          </div>
          <div className="bg-[var(--input-background)] p-4 rounded-lg">
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">최고 수익 종목</h3>
            <p className="text-[var(--text-accent-green)]">삼성전자 (+5.2%)</p>
          </div>
          <div className="bg-[var(--input-background)] p-4 rounded-lg">
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">거래 횟수</h3>
            <p className="text-[var(--text-primary)]">총 12회 (매수 7회, 매도 5회)</p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        title="AI 추천"
      >
        <div className="space-y-3">
          <div className="bg-[var(--input-background)] p-4 rounded-lg">
            <h3 className="text-[var(--text-accent-green)] font-semibold mb-2">매수 추천</h3>
            <p className="text-[var(--text-primary)]">LG화학</p>
            <p className="text-[var(--text-secondary)] text-sm">배터리 산업 성장 전망</p>
          </div>
          <div className="bg-[var(--input-background)] p-4 rounded-lg">
            <h3 className="text-[var(--text-accent-yellow)] font-semibold mb-2">관심 종목</h3>
            <p className="text-[var(--text-primary)]">삼성바이오로직스</p>
            <p className="text-[var(--text-secondary)] text-sm">바이오 섹터 회복 신호</p>
          </div>
          <div className="bg-[var(--input-background)] p-4 rounded-lg">
            <h3 className="text-[var(--text-accent-red)] font-semibold mb-2">리밸런싱 제안</h3>
            <p className="text-[var(--text-primary)]">IT 비중 축소 고려</p>
            <p className="text-[var(--text-secondary)] text-sm">포트폴리오 집중도 완화</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuickActions;