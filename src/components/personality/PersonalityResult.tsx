import React from 'react';
import { PersonalityType } from './InvestmentPersonalityTest';
import { TrendingUp, Shield, Target, AlertTriangle, PieChart, BookOpen, RotateCcw, Download } from 'lucide-react';

interface PersonalityResultProps {
  result: PersonalityType;
  onReset: () => void;
}

const PersonalityResult: React.FC<PersonalityResultProps> = ({ result, onReset }) => {
  const downloadReport = () => {
    // 실제 구현에서는 PDF 생성 라이브러리를 사용할 수 있습니다
    alert('투자 성향 리포트 다운로드 기능은 준비 중입니다.');
  };

  return (
    <div className="space-y-4">
      {/* 결과 헤더 */}
      <div 
        className={`glass-card p-4 sm:p-6 lg:p-8 text-center bg-gradient-to-r ${result.color}`}
        style={{ 
          background: `linear-gradient(to right, var(--gradient-personality-${result.type.toLowerCase()}-start), var(--gradient-personality-${result.type.toLowerCase()}-end))`
        }}
      >
        <div className="mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">{result.name}</h1>
          <p className="text-[var(--text-white-90)] text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
            {result.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
          <button
            onClick={onReset}
            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            다시 테스트
          </button>
          <button
            onClick={downloadReport}
            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            리포트 다운로드
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 성향 특징 */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-accent-blue)]" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">투자 성향 특징</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {result.characteristics.map((characteristic, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-[var(--text-accent-blue)] rounded-full"></div>
                <span className="text-[var(--text-tertiary)] text-xs sm:text-sm">{characteristic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 자산 배분 */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-accent-purple)]" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">추천 자산 배분</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(result.recommendations.assetAllocation).map(([asset, percentage]) => (
              <div key={asset}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[var(--text-tertiary)] text-xs sm:text-sm">{asset}</span>
                  <span className="text-[var(--text-primary)] font-semibold text-xs sm:text-sm">{percentage}%</span>
                </div>
                <div className="w-full bg-[var(--input-border)] rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 추천 투자 상품 */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-accent-green)]" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">추천 투자 상품</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {result.recommendations.investmentProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[var(--input-background)] rounded-lg">
                <div className="w-2 h-2 bg-[var(--text-accent-green)] rounded-full"></div>
                <span className="text-[var(--text-tertiary)] text-xs sm:text-sm">{product}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 투자 전략 */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-accent-yellow)]" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">추천 투자 전략</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {result.recommendations.strategies.map((strategy, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-[var(--input-background)] rounded-lg">
                <div className="w-2 h-2 bg-[var(--text-accent-yellow)] rounded-full"></div>
                <span className="text-[var(--text-tertiary)] text-xs sm:text-sm">{strategy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-accent-red)]" />
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">투자 시 주의사항</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.recommendations.warnings.map((warning, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-500/10 border border-[var(--text-accent-red)]/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-accent-red)] mt-0.5 flex-shrink-0" />
              <span className="text-[var(--text-tertiary)] text-xs">{warning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 추가 정보 */}
      <div 
        className="glass-card p-4 sm:p-6"
        style={{ background: 'linear-gradient(to right, var(--gradient-info-blue-start), var(--gradient-info-blue-end))' }}
      >
        <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] mb-3 sm:mb-4">💡 투자 성향 활용 팁</h3>
        <div className="space-y-2 sm:space-y-3 text-[var(--text-tertiary)] text-xs">
          <p>• 이 결과는 현재 상황을 기반으로 한 것이며, 시간이 지나면서 변할 수 있습니다.</p>
          <p>• 정기적으로 투자 성향을 재평가하여 포트폴리오를 조정하세요.</p>
          <p>• 투자 전에는 반드시 전문가와 상담하거나 충분한 학습을 하시기 바랍니다.</p>
          <p>• 분산 투자를 통해 리스크를 관리하는 것이 중요합니다.</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalityResult;