import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Percent, BarChart3 } from 'lucide-react';

const CompoundCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<string>('1,000,000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('100,000');
  const [annualRate, setAnnualRate] = useState<string>('7');
  const [years, setYears] = useState<string>('10');
  const [compoundFrequency, setCompoundFrequency] = useState<string>('12');
  const [showPeriodAnalysis, setShowPeriodAnalysis] = useState(false);

  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrincipal(formatNumber(e.target.value));
  };

  const handleMonthlyContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyContribution(formatNumber(e.target.value));
  };

  const calculateCompound = () => {
    const p = parseNumber(principal);
    const pmt = parseNumber(monthlyContribution);
    const r = (parseFloat(annualRate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = parseFloat(compoundFrequency) || 12;

    const compoundAmount = p * Math.pow(1 + r / n, n * t);
    const monthlyRate = r / 12;
    const monthlyCompound = pmt * (Math.pow(1 + monthlyRate, 12 * t) - 1) / monthlyRate;
    
    const finalAmount = compoundAmount + monthlyCompound;
    const totalContributions = p + (pmt * 12 * t);
    const totalInterest = finalAmount - totalContributions;

    return {
      finalAmount,
      totalContributions,
      totalInterest,
      returnRate: ((finalAmount - totalContributions) / totalContributions) * 100
    };
  };

  const calculateYearlyAnalysis = () => {
    const p = parseNumber(principal);
    const pmt = parseNumber(monthlyContribution);
    const r = (parseFloat(annualRate) || 0) / 100;
    const n = parseFloat(compoundFrequency) || 12;
    const monthlyRate = r / 12;
    const currentYears = parseFloat(years) || 10;

    const yearlyData = [];
    
    for (let year = 1; year <= currentYears; year++) {
      const compoundAmount = p * Math.pow(1 + r / n, n * year);
      const monthlyCompound = pmt * (Math.pow(1 + monthlyRate, 12 * year) - 1) / monthlyRate;
      const finalAmount = compoundAmount + monthlyCompound;
      const totalContributions = p + (pmt * 12 * year);
      const totalInterest = finalAmount - totalContributions;
      const returnRate = ((finalAmount - totalContributions) / totalContributions) * 100;

      yearlyData.push({
        year,
        finalAmount,
        totalContributions,
        totalInterest,
        returnRate,
        isCurrentTarget: year === currentYears
      });
    }

    return yearlyData;
  };

  const calculateFutureProjections = () => {
    const p = parseNumber(principal);
    const pmt = parseNumber(monthlyContribution);
    const r = (parseFloat(annualRate) || 0) / 100;
    const n = parseFloat(compoundFrequency) || 12;
    const monthlyRate = r / 12;
    const currentYears = parseFloat(years) || 10;

    const futureProjections = [];
    
    for (let i = 1; i <= 3; i++) {
      const year = currentYears + (i * 3);
      const compoundAmount = p * Math.pow(1 + r / n, n * year);
      const monthlyCompound = pmt * (Math.pow(1 + monthlyRate, 12 * year) - 1) / monthlyRate;
      const finalAmount = compoundAmount + monthlyCompound;
      const totalContributions = p + (pmt * 12 * year);
      const totalInterest = finalAmount - totalContributions;
      const returnRate = ((finalAmount - totalContributions) / totalContributions) * 100;

      futureProjections.push({
        year,
        finalAmount,
        totalContributions,
        totalInterest,
        returnRate
      });
    }

    return futureProjections;
  };

  const result = calculateCompound();
  const yearlyAnalysis = calculateYearlyAnalysis();
  const futureProjections = calculateFutureProjections();

  const renderPeriodAnalysis = () => (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
        <h3 className="text-base sm:text-lg font-bold text-white">투자 기간별 분석</h3>
      </div>

      <div className="mb-4 sm:mb-6">
        <p className="text-gray-300 text-xs mb-4">
          현재 설정된 조건으로 <span className="text-orange-400 font-semibold">매년</span> 어떻게 자산이 증가하는지 확인하고, 
          <span className="text-green-400 font-semibold"> 미래 결과</span>도 함께 살펴보세요.
        </p>
      </div>

      {/* 매년 결과 - 테이블 형태 */}
      <div className="mb-6 sm:mb-8">
        <h4 className="text-white font-semibold mb-4">📅 목표까지 매년 결과</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium">연도</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium">최종금액</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium">총수익</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium">수익률</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium">연간증가</th>
              </tr>
            </thead>
            <tbody>
              {yearlyAnalysis.map((data, index) => {
                const prevData = index > 0 ? yearlyAnalysis[index - 1] : null;
                const yearlyGrowth = prevData ? data.finalAmount - prevData.finalAmount : data.finalAmount - parseNumber(principal);
                
                return (
                  <tr 
                    key={data.year} 
                    className={`border-b border-gray-700 hover:bg-white/8 transition-colors ${
                      data.isCurrentTarget ? 'bg-blue-500/10 border-blue-500/30' : ''
                    }`}
                  >
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className={`font-semibold text-xs ${
                          data.isCurrentTarget ? 'text-blue-400' : 'text-white'
                        }`}>
                          {data.year}년차
                        </span>
                        {data.isCurrentTarget && (
                          <span className="text-xs bg-blue-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">목표</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                      <span className="text-white font-semibold text-xs">
                        ₩{(data.finalAmount / 1000000).toFixed(1)}M
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                      <span className="text-green-400 font-semibold text-xs">
                        +₩{(data.totalInterest / 1000000).toFixed(1)}M
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                      <span className={`font-semibold text-xs ${
                        data.returnRate >= 100 ? 'text-yellow-400' : 
                        data.returnRate >= 50 ? 'text-green-400' : 'text-blue-400'
                      }`}>
                        +{data.returnRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                      <span className="text-purple-400 font-medium text-xs">
                        +₩{(yearlyGrowth / 1000000).toFixed(1)}M
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3년 단위 미래 예상 */}
      <div className="mb-6 sm:mb-8">
        <h4 className="text-green-400 font-semibold mb-4">🚀 미래 예상 결과 (3년 단위, 3개까지)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {futureProjections.map((projection, index) => (
            <div key={projection.year} className="bg-gradient-to-r from-green-900/20 to-teal-900/20 p-3 sm:p-4 rounded-lg border border-green-500/20">
              <h5 className="text-green-400 font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">
                +{(index + 1) * 3}년 후 ({projection.year}년차)
              </h5>
              <div className="space-y-1 sm:space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-300">최종금액:</span>
                  <span className="text-white font-bold">
                    ₩{(projection.finalAmount / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">총수익:</span>
                  <span className="text-green-400 font-semibold">
                    +₩{(projection.totalInterest / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">수익률:</span>
                  <span className="text-green-400 font-semibold">
                    +{projection.returnRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">현재대비:</span>
                  <span className="text-yellow-400 font-semibold">
                    +₩{((projection.finalAmount - result.finalAmount) / 1000000).toFixed(1)}M
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 복리 효과 설명 */}
      <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-3 sm:p-4 rounded-lg border border-yellow-500/20">
        <h4 className="text-yellow-400 font-semibold mb-2">🔥 복리의 마법</h4>
        <div className="space-y-1 sm:space-y-2 text-xs text-gray-300">
          <p>• <strong>초기 단계 (1-3년):</strong> 월 납입금의 영향이 큼</p>
          <p>• <strong>성장 단계 (4-7년):</strong> 복리 효과가 본격적으로 나타남</p>
          <p>• <strong>가속 단계 (8-12년):</strong> 복리가 월 납입금을 압도하기 시작</p>
          <p>• <strong>폭발 단계 (13년 이후):</strong> 복리 효과가 기하급수적으로 증가</p>
          <p className="text-yellow-400 font-medium">
            ⭐ <strong>시간이 지날수록</strong> 놀라운 변화를 경험할 수 있습니다!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">복리 계산기</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                초기 투자금 (원)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={principal}
                  onChange={handlePrincipalChange}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none text-xs sm:text-sm"
                  placeholder="1,000,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                월 납입금 (원)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={monthlyContribution}
                  onChange={handleMonthlyContributionChange}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none text-xs sm:text-sm"
                  placeholder="100,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                연 수익률 (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none text-xs sm:text-sm"
                  placeholder="7"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                투자 기간 (년)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none text-xs sm:text-sm"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                복리 주기 (연간)
              </label>
              <select
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value)}
                className="w-full p-2 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none text-xs sm:text-sm"
              >
                <option value="1">연 1회</option>
                <option value="4">분기별 (연 4회)</option>
                <option value="12">월별 (연 12회)</option>
                <option value="365">일별 (연 365회)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 rounded-xl">
              <h3 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4">계산 결과</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-blue-100 text-xs">최종 금액</p>
                  <p className="text-base sm:text-xl font-bold text-white">
                    ₩{result.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs">총 투자금</p>
                  <p className="text-xs sm:text-base">
                    ₩{result.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs">총 수익</p>
                  <p className="text-xs sm:text-base font-semibold">
                    ₩{result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs">수익률</p>
                  <p className="text-xs sm:text-base font-semibold">
                    {result.returnRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">투자 분석</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">월 평균 수익</span>
                  <span className="text-white">
                    ₩{(result.totalInterest / (parseFloat(years) * 12)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">연 평균 수익</span>
                  <span className="text-white">
                    ₩{(result.totalInterest / parseFloat(years)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">투자 배수</span>
                  <span className="text-green-400 font-semibold">
                    {(result.finalAmount / result.totalContributions).toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 sm:p-4 rounded-lg">
              <h4 className="text-yellow-400 font-semibold mb-2 text-sm sm:text-base">💡 복리의 힘</h4>
              <p className="text-gray-300 text-xs">
                단순히 원금과 월납입금을 합한 <strong>{result.totalContributions.toLocaleString()}원</strong>이 
                복리 효과로 인해 <strong className="text-yellow-400">{result.finalAmount.toLocaleString()}원</strong>이 되어 
                <strong className="text-green-400"> {result.totalInterest.toLocaleString()}원의 추가 수익</strong>을 얻게 됩니다!
              </p>
            </div>

            <button
              onClick={() => setShowPeriodAnalysis(!showPeriodAnalysis)}
              className="w-full py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <BarChart3 className="w-4 h-4" />
              {showPeriodAnalysis ? '기간별 분석 숨기기' : '기간별 분석 보기'}
            </button>
          </div>
        </div>
      </div>

      {showPeriodAnalysis && renderPeriodAnalysis()}
    </div>
  );
};

export default CompoundCalculator;