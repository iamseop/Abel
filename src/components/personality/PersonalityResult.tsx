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
    <div className="space-y-6">
      {/* 결과 헤더 */}
      <div className={`glass-card p-4 sm:p-6 lg:p-8 text-center bg-gradient-to-r ${result.color}`}>
        <div className="mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{result.name}</h1>
          <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 성향 특징 */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">투자 성향 특징</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {result.characteristics.map((characteristic, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300 text-sm sm:text-base">{characteristic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 자산 배분 */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">추천 자산 배분</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(result.recommendations.assetAllocation).map(([asset, percentage]) => (
              <div key={asset}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm sm:text-base">{asset}</span>
                  <span className="text-white font-semibold text-sm sm:text-base">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
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
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">추천 투자 상품</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {result.recommendations.investmentProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-sm sm:text-base">{product}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 투자 전략 */}
        <div className="glass-card p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">추천 투자 전략</h2>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {result.recommendations.strategies.map((strategy, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300 text-sm sm:text-base">{strategy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
          <h2 className="text-lg sm:text-xl font-bold text-white">투자 시 주의사항</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {result.recommendations.warnings.map((warning, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300 text-xs sm:text-sm">{warning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="glass-card p-4 sm:p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">💡 투자 성향 활용 팁</h3>
        <div className="space-y-2 sm:space-y-3 text-gray-300 text-xs sm:text-sm">
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