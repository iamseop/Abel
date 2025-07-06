import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Percent, BarChart3 } from 'lucide-react';

const CompoundCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<string>('1,000,000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('100,000');
  const [annualRate, setAnnualRate] = useState<string>('7');
  const [years, setYears] = useState<string>('10');
  const [compoundFrequency, setCompoundFrequency] = useState<string>('12');
  const [showPeriodAnalysis, setShowPeriodAnalysis] = useState(false);

  // 숫자에 쉼표 추가하는 함수
  const formatNumber = (value: string): string => {
    // 숫자가 아닌 문자 제거
    const numericValue = value.replace(/[^\d]/g, '');
    // 쉼표 추가
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 쉼표 제거하고 숫자만 반환하는 함수
  const parseNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  // 입력값 변경 핸들러
  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setPrincipal(formatted);
  };

  const handleMonthlyContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setMonthlyContribution(formatted);
  };

  const calculateCompound = () => {
    const p = parseNumber(principal);
    const pmt = parseNumber(monthlyContribution);
    const r = (parseFloat(annualRate) || 0) / 100;
    const t = parseFloat(years) || 0;
    const n = parseFloat(compoundFrequency) || 12;

    // 원금 복리 계산
    const compoundAmount = p * Math.pow(1 + r / n, n * t);
    
    // 월 납입금 복리 계산 (연금 공식)
    const monthlyRate = r / 12;
    const monthlyCompound = pmt * (Math.pow(1 + monthlyRate, 12 * t) - 1) / monthlyRate;
    
    const finalAmount = compoundAmount + monthlyCompound;
    const totalContributions = p + (pmt * 12 * t);
    const totalInterest = finalAmount - totalContributions;

    return {
      finalAmount,
      totalContributions,
      totalInterest,
      returnRate: ((finalAmount - totalContributions) / totalContributions) * 100,
      compoundAmount,
      monthlyCompound,
      p,
      pmt,
      r,
      t,
      n,
      monthlyRate
    };
  };

  // 매년 계산 결과
  const calculateYearlyAnalysis = () => {
    const p = parseNumber(principal);
    const pmt = parseNumber(monthlyContribution);
    const r = (parseFloat(annualRate) || 0) / 100;
    const n = parseFloat(compoundFrequency) || 12;
    const monthlyRate = r / 12;
    const maxYears = Math.min(parseFloat(years) || 10, 30); // 최대 30년까지

    const yearlyData = [];
    
    for (let year = 1; year <= maxYears; year++) {
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
        compoundAmount,
        monthlyCompound
      });
    }

    return yearlyData;
  };

  const result = calculateCompound();
  const yearlyAnalysis = calculateYearlyAnalysis();

  const renderYearlyAnalysis = () => (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-orange-400" />
        <h3 className="text-xl font-bold text-white">매년 투자 결과 분석</h3>
      </div>

      <div className="mb-6">
        <p className="text-gray-300 text-sm mb-4">
          현재 설정된 조건으로 <span className="text-orange-400 font-semibold">매년</span> 어떻게 자산이 증가하는지 확인해보세요. 
          <span className="text-orange-400 font-semibold"> 시간이 지날수록 복리 효과가 가속화</span>되는 것을 볼 수 있습니다.
        </p>
      </div>

      {/* 매년 결과 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 text-gray-400 font-medium">연도</th>
              <th className="text-right py-3 px-2 text-gray-400 font-medium">총 투자금</th>
              <th className="text-right py-3 px-2 text-gray-400 font-medium">최종 금액</th>
              <th className="text-right py-3 px-2 text-gray-400 font-medium">총 수익</th>
              <th className="text-right py-3 px-2 text-gray-400 font-medium">수익률</th>
              <th className="text-right py-3 px-2 text-gray-400 font-medium">연간 증가</th>
            </tr>
          </thead>
          <tbody>
            {yearlyAnalysis.map((data, index) => {
              const prevYearAmount = index > 0 ? yearlyAnalysis[index - 1].finalAmount : parseNumber(principal);
              const yearlyGrowth = data.finalAmount - prevYearAmount;
              const isCurrentYear = data.year === parseFloat(years);
              
              return (
                <tr 
                  key={data.year} 
                  className={`border-b border-gray-800 hover:bg-white/5 transition-colors ${
                    isCurrentYear ? 'bg-blue-500/10 border-blue-500/20' : ''
                  }`}
                >
                  <td className="py-3 px-2">
                    <span className={`font-semibold ${
                      isCurrentYear ? 'text-blue-400' : 'text-white'
                    }`}>
                      {data.year}년차
                    </span>
                    {isCurrentYear && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">목표</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-300">
                    ₩{data.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-2 text-right text-white font-bold">
                    ₩{data.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-2 text-right text-green-400 font-semibold">
                    +₩{data.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-3 px-2 text-right font-semibold">
                    <span className={`${
                      data.returnRate >= 100 ? 'text-yellow-400' : 
                      data.returnRate >= 50 ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      +{data.returnRate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right text-purple-400 font-medium">
                    +₩{yearlyGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 연도별 인사이트 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-lg border border-blue-500/20">
          <h4 className="text-blue-400 font-semibold mb-2">📈 복리 가속화 패턴</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <strong>1년차:</strong> ₩{yearlyAnalysis[0]?.finalAmount.toLocaleString()} (기반 구축)</p>
            <p>• <strong>5년차:</strong> ₩{yearlyAnalysis[4]?.finalAmount.toLocaleString()} (성장 시작)</p>
            <p>• <strong>10년차:</strong> ₩{yearlyAnalysis[9]?.finalAmount.toLocaleString()} (가속화)</p>
            {yearlyAnalysis.length > 15 && (
              <p>• <strong>15년차:</strong> ₩{yearlyAnalysis[14]?.finalAmount.toLocaleString()} (기하급수적 증가)</p>
            )}
            <p className="text-blue-400 font-medium">
              ⚡ 후반부로 갈수록 연간 증가폭이 급격히 커집니다!
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-900/20 to-teal-900/20 p-4 rounded-lg border border-green-500/20">
          <h4 className="text-green-400 font-semibold mb-2">💰 연간 증가 분석</h4>
          <div className="space-y-2 text-sm text-gray-300">
            {yearlyAnalysis.length >= 5 && (
              <>
                <p>• <strong>초기 5년 평균:</strong> 연 ₩{(yearlyAnalysis.slice(0, 5).reduce((sum, data, index) => {
                  const prevAmount = index > 0 ? yearlyAnalysis[index - 1].finalAmount : parseNumber(principal);
                  return sum + (data.finalAmount - prevAmount);
                }, 0) / 5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                
                {yearlyAnalysis.length >= 10 && (
                  <p>• <strong>후반 5년 평균:</strong> 연 ₩{(yearlyAnalysis.slice(5, 10).reduce((sum, data, index) => {
                    const prevAmount = yearlyAnalysis[index + 4].finalAmount;
                    return sum + (data.finalAmount - prevAmount);
                  }, 0) / 5).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                )}
              </>
            )}
            <p className="text-green-400 font-medium">
              💡 시간이 지날수록 <strong>연간 증가액이 기하급수적으로 증가</strong>합니다!
            </p>
          </div>
        </div>
      </div>

      {/* 시각적 비교 - 매년 */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h4 className="text-white font-semibold mb-4">📊 연도별 자산 증가 시각화</h4>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {yearlyAnalysis.map((data) => {
            const maxAmount = Math.max(...yearlyAnalysis.map(p => p.finalAmount));
            const widthPercent = (data.finalAmount / maxAmount) * 100;
            const isCurrentYear = data.year === parseFloat(years);
            
            return (
              <div key={data.year} className="flex items-center gap-3">
                <div className="w-12 text-right">
                  <span className={`text-sm ${isCurrentYear ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>
                    {data.year}년
                  </span>
                </div>
                <div className="flex-1 bg-gray-700 rounded-full h-5 relative overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isCurrentYear 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                    style={{ width: `${widthPercent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      ₩{(data.finalAmount / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className={`text-sm font-semibold ${
                    data.returnRate >= 100 ? 'text-yellow-400' : 
                    data.returnRate >= 50 ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    +{data.returnRate.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 복리 효과 설명 */}
      <div className="mt-6 bg-gradient-to-r from-orange-900/20 to-red-900/20 p-4 rounded-lg border border-orange-500/20">
        <h4 className="text-orange-400 font-semibold mb-2">🔥 복리의 마법</h4>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• <strong>1-5년:</strong> 월 납입금의 영향이 큼 (기반 구축 단계)</p>
          <p>• <strong>6-10년:</strong> 복리 효과가 본격적으로 나타남 (성장 가속화)</p>
          <p>• <strong>11년 이후:</strong> 복리가 월 납입금을 압도 (기하급수적 증가)</p>
          <p className="text-orange-400 font-medium">
            ⭐ <strong>시간</strong>이야말로 투자의 가장 강력한 무기입니다!
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">복리 계산기</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                초기 투자금 (원)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={principal}
                  onChange={handlePrincipalChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="1,000,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                월 납입금 (원)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={monthlyContribution}
                  onChange={handleMonthlyContributionChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="100,000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                연 수익률 (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="7"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                투자 기간 (년)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                복리 주기 (연간)
              </label>
              <select
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="1">연 1회</option>
                <option value="4">분기별 (연 4회)</option>
                <option value="12">월별 (연 12회)</option>
                <option value="365">일별 (연 365회)</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl">
              <h3 className="text-white font-bold text-lg mb-4">계산 결과</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-blue-100 text-sm">최종 금액</p>
                  <p className="text-white text-2xl font-bold">
                    ₩{result.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">총 투자금</p>
                  <p className="text-white text-lg">
                    ₩{result.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">총 수익</p>
                  <p className="text-green-300 text-lg font-semibold">
                    ₩{result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm">수익률</p>
                  <p className="text-green-300 text-lg font-semibold">
                    {result.returnRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="text-white font-semibold mb-4">투자 분석</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">월 평균 수익</span>
                  <span className="text-white">
                    ₩{(result.totalInterest / (parseFloat(years) * 12)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">연 평균 수익</span>
                  <span className="text-white">
                    ₩{(result.totalInterest / parseFloat(years)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">투자 배수</span>
                  <span className="text-green-400 font-semibold">
                    {(result.finalAmount / result.totalContributions).toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
              <h4 className="text-yellow-400 font-semibold mb-2">💡 복리의 힘</h4>
              <p className="text-gray-300 text-sm">
                단순히 원금과 월납입금을 합한 <strong>{result.totalContributions.toLocaleString()}원</strong>이 
                복리 효과로 인해 <strong className="text-yellow-400">{result.finalAmount.toLocaleString()}원</strong>이 되어 
                <strong className="text-green-400"> {result.totalInterest.toLocaleString()}원의 추가 수익</strong>을 얻게 됩니다!
              </p>
            </div>

            <button
              onClick={() => setShowPeriodAnalysis(!showPeriodAnalysis)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {showPeriodAnalysis ? '매년 분석 숨기기' : '매년 분석 보기'}
            </button>
          </div>
        </div>
      </div>

      {showPeriodAnalysis && renderYearlyAnalysis()}
    </div>
  );
};

export default CompoundCalculator;