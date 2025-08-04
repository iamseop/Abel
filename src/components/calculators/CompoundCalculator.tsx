import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Percent, BarChart3 } from 'lucide-react';
import { cleanNumericInput, formatNumber, formatCurrencyNoDecimals, formatPercentage, parseNumber } from '../../utils/formatters';

const CompoundCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<string>('1000000'); // 쉼표 없는 초기값
  const [monthlyContribution, setMonthlyContribution] = useState<string>('100000'); // 쉼표 없는 초기값
  const [annualRate, setAnnualRate] = useState<string>('7');
  const [years, setYears] = useState<string>('10');
  const [compoundFrequency, setCompoundFrequency] = useState<string>('12');
  const [showPeriodAnalysis, setShowPeriodAnalysis] = useState(false);

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrincipal(cleanNumericInput(e.target.value));
  };

  const handleMonthlyContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyContribution(cleanNumericInput(e.target.value));
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
        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-accent-orange)]" />
        <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">투자 기간별 분석</h3>
      </div>

      <div className="mb-4 sm:mb-6">
        <p className="text-[var(--text-tertiary)] text-xs mb-4">
          현재 설정된 조건으로 <span className="text-[var(--text-accent-orange)] font-semibold">매년</span> 어떻게 자산이 증가하는지 확인하고, 
          <span className="text-[var(--text-accent-green)] font-semibold"> 미래 결과</span>도 함께 살펴보세요.
        </p>
      </div>

      {/* 매년 결과 - 테이블 형태 */}
      <div className="mb-6 sm:mb-8">
        <h4 className="text-[var(--text-primary)] font-semibold mb-4">📅 목표까지 매년 결과</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--input-border)]">
                <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-[var(--text-tertiary)] font-medium">연도</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-[var(--text-tertiary)] font-medium">최종금액</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-[var(--text-tertiary)] font-medium">총수익</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-[var(--text-tertiary)] font-medium">수익률</th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-[var(--text-tertiary)] font-medium">연간증가</th>
              </tr>
            </thead>
            <tbody>
              {yearlyAnalysis.map((data, index) => {
                const prevData = index > 0 ? yearlyAnalysis[index - 1] : null;
                const yearlyGrowth = prevData ? data.finalAmount - prevData.finalAmount : data.finalAmount - parseNumber(principal);
                
                return (
                  <tr 
                    key={data.year} 
                    className={`border-b border-[var(--input-border)] hover:bg-[var(--card-background-hover)] transition-colors ${
                      data.isCurrentTarget ? 'bg-[var(--text-accent-blue)]/10 border-[var(--text-accent-blue)]/30' : ''
                    }`}
                  >
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className={`font-semibold text-xs ${
                          data.isCurrentTarget ? 'text-[var(--text-accent-blue)]' : 'text-[var(--text-primary)]'
                        }`}>
                          {data.year}년차
                        </span>
                        {data.isCurrentTarget && (
                          <span className="text-xs bg-[var(--text-accent-blue)] text-[var(--text-primary)] px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">목표</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                      <span className="text-[var(--text-primary)] font-semibold text-xs">
                        ₩{formatCurrencyNoDecimals(data.finalAmount)}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                      <span className="text-[var(--text-accent-green)] font-semibold text-xs">
                        +₩{formatCurrencyNoDecimals(data.totalInterest)}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                      <span className={`font-semibold text-xs ${
                        data.returnRate >= 100 ? 'text-[var(--text-accent-yellow)]' : 
                        data.returnRate >= 50 ? 'text-[var(--text-accent-green)]' : 'text-[var(--text-accent-blue)]'
                      }`}>
                        +{formatPercentage(data.returnRate, 1)}%
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right">
                      <span className="text-[var(--text-accent-purple)] font-medium text-xs">
                        +₩{formatCurrencyNoDecimals(yearlyGrowth)}
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
      <div className="mb-4">
        <h4 className="text-[var(--text-accent-green)] font-semibold mb-4">🚀 미래 예상 결과 (3년 단위, 3개까지)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {futureProjections.map((projection, index) => (
            <div 
              key={projection.year} 
              className="p-3 sm:p-4 rounded-lg border border-[var(--text-accent-green)]/20"
              style={{ background: 'linear-gradient(to right, var(--gradient-info-green-start), var(--gradient-info-green-end))' }}
            >
              <h5 className="text-[var(--text-accent-green)] font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">
                +{(index + 1) * 3}년 후 ({projection.year}년차)
              </h5>
              <div className="space-y-1 sm:space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)]">최종금액:</span>
                  <span className="text-[var(--text-primary)] font-bold">
                    ₩{formatCurrencyNoDecimals(projection.finalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)]">총수익:</span>
                  <span className="text-[var(--text-accent-green)] font-semibold">
                    +₩{formatCurrencyNoDecimals(projection.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)]">수익률:</span>
                  <span className="text-[var(--text-accent-green)] font-semibold">
                    +{formatPercentage(projection.returnRate, 1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-tertiary)]">현재대비:</span>
                  <span className="text-[var(--text-accent-yellow)] font-semibold">
                    +₩{formatCurrencyNoDecimals(projection.finalAmount - result.finalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 복리 효과 설명 */}
      <div 
        className="p-3 sm:p-4 rounded-lg border border-[var(--text-accent-yellow)]/20"
        style={{ background: 'linear-gradient(to right, var(--gradient-info-yellow-start), var(--gradient-info-yellow-end))' }}
      >
        <h4 className="text-[var(--text-accent-yellow)] font-semibold mb-2">🔥 복리의 마법</h4>
        <div className="space-y-1 sm:space-y-2 text-xs text-[var(--text-tertiary)]">
          <p>• <strong>초기 단계 (1-3년):</strong> 월 납입금의 영향이 큼</p>
          <p>• <strong>성장 단계 (4-7년):</strong> 복리 효과가 본격적으로 나타남</p>
          <p>• <strong>가속 단계 (8-12년):</strong> 복리가 월 납입금을 압도하기 시작</p>
          <p>• <strong>폭발 단계 (13년 이후):</strong> 복리 효과가 기하급수적으로 증가</p>
          <p className="text-[var(--text-accent-yellow)] font-medium">
            ⭐ <strong>시간이 지날수록</strong> 놀라운 변화를 경험할 수 있습니다!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="glass-card p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-accent-blue)]" />
          <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">복리 계산기</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                초기 투자금 (원)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={formatNumber(principal)} // 쉼표 추가하여 표시
                  onChange={handlePrincipalChange}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none text-xs sm:text-sm placeholder:text-[var(--input-placeholder)]"
                  placeholder="1,000,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                월 납입금 (원)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={formatNumber(monthlyContribution)} // 쉼표 추가하여 표시
                  onChange={handleMonthlyContributionChange}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none text-xs sm:text-sm placeholder:text-[var(--input-placeholder)]"
                  placeholder="100,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                연 수익률 (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(cleanNumericInput(e.target.value))}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none text-xs sm:text-sm placeholder:text-[var(--input-placeholder)]"
                  placeholder="7"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                투자 기간 (년)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={years}
                  onChange={(e) => setYears(cleanNumericInput(e.target.value))}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none text-xs sm:text-sm placeholder:text-[var(--input-placeholder)]"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                복리 주기 (연간)
              </label>
              <select
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value)}
                className="w-full p-2 sm:p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none text-xs sm:text-sm"
              >
                <option value="1">연 1회</option>
                <option value="4">분기별 (연 4회)</option>
                <option value="12">월별 (연 12회)</option>
                <option value="365">일별 (연 365회)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div 
              className="p-4 sm:p-6 rounded-xl"
              style={{ background: 'linear-gradient(to right, var(--gradient-compound-start), var(--gradient-compound-end))' }}
            >
              <h3 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4">계산 결과</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-blue-100 text-xs">최종 금액</p>
                  <p className="text-base sm:text-xl font-bold text-white">
                    ₩{formatCurrencyNoDecimals(result.finalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs">총 투자금</p>
                  <p className="text-xs sm:text-base text-white">
                    ₩{formatCurrencyNoDecimals(result.totalContributions)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs">총 수익</p>
                  <p className="text-xs sm:text-base font-semibold text-white">
                    ₩{formatCurrencyNoDecimals(result.totalInterest)}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-xs">수익률</p>
                  <p className="text-xs sm:text-base font-semibold text-white">
                    {formatPercentage(result.returnRate, 1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[var(--input-background)] p-4 sm:p-6 rounded-xl">
              <h4 className="text-[var(--text-primary)] font-semibold mb-3 sm:mb-4 text-sm sm:text-base">투자 분석</h4>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">월 평균 수익</span>
                  <span className="text-[var(--text-primary)]">
                    ₩{formatCurrencyNoDecimals(result.totalInterest / (parseFloat(years) * 12))}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">연 평균 수익</span>
                  <span className="text-[var(--text-primary)]">
                    ₩{formatCurrencyNoDecimals(result.totalInterest / parseFloat(years))}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">투자 배수</span>
                  <span className="text-[var(--text-accent-green)] font-semibold">
                    {formatNumber(result.finalAmount / result.totalContributions, { maximumFractionDigits: 2 })}x
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPeriodAnalysis(!showPeriodAnalysis)}
              className="w-full py-2 sm:py-3 bg-[var(--text-accent-purple)] hover:bg-purple-700 text-[var(--text-primary)] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
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