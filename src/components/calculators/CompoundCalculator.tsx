import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Percent, BarChart3, Target } from 'lucide-react';

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

  // 3년 단위 계산 결과
  const calculateThreeYearAnalysis = () => {
    const p = parseNumber(principal);
    const pmt = parseNumber(monthlyContribution);
    const r = (parseFloat(annualRate) || 0) / 100;
    const n = parseFloat(compoundFrequency) || 12;
    const monthlyRate = r / 12;
    const currentYears = parseFloat(years) || 10;
    const maxYears = Math.max(currentYears + 12, 30); // 현재 설정 + 12년 또는 30년 중 큰 값

    const yearlyData = [];
    
    // 3년 단위로 계산
    for (let year = 3; year <= maxYears; year += 3) {
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
        monthlyCompound,
        isCurrentTarget: year === currentYears,
        isFuture: year > currentYears
      });
    }

    // 현재 목표 연도가 3의 배수가 아닌 경우 추가
    if (currentYears % 3 !== 0) {
      const compoundAmount = p * Math.pow(1 + r / n, n * currentYears);
      const monthlyCompound = pmt * (Math.pow(1 + monthlyRate, 12 * currentYears) - 1) / monthlyRate;
      const finalAmount = compoundAmount + monthlyCompound;
      const totalContributions = p + (pmt * 12 * currentYears);
      const totalInterest = finalAmount - totalContributions;
      const returnRate = ((finalAmount - totalContributions) / totalContributions) * 100;

      yearlyData.push({
        year: currentYears,
        finalAmount,
        totalContributions,
        totalInterest,
        returnRate,
        compoundAmount,
        monthlyCompound,
        isCurrentTarget: true,
        isFuture: false
      });
    }

    // 연도순으로 정렬
    return yearlyData.sort((a, b) => a.year - b.year);
  };

  const result = calculateCompound();
  const threeYearAnalysis = calculateThreeYearAnalysis();
  const currentTargetYear = parseFloat(years) || 10;

  const renderThreeYearAnalysis = () => (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-orange-400" />
        <h3 className="text-xl font-bold text-white">3년 단위 투자 결과 분석</h3>
      </div>

      <div className="mb-6">
        <p className="text-gray-300 text-sm mb-4">
          현재 설정된 조건으로 <span className="text-orange-400 font-semibold">3년마다</span> 어떻게 자산이 증가하는지 확인해보세요. 
          <span className="text-orange-400 font-semibold"> 시간이 지날수록 복리 효과가 가속화</span>되는 것을 볼 수 있습니다.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-300">목표 연도 ({currentTargetYear}년)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-gray-300">현재까지 ({currentTargetYear}년 이하)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-300">미래 예상 ({currentTargetYear}년 초과)</span>
          </div>
        </div>
      </div>

      {/* 3년 단위 결과 테이블 */}
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-900">
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-2 text-gray-400 font-medium">연도</th>
              <th className="text-right py-3 px-2 text-gray-400 font-medium">총 투자금</th>
              <th className="text-right py-3 px-2 text-gray-400 font-medium">최종 금액</th>
              <th className="text-right py-3 px-2 text-gray-400 font-medium">총 수익</th>
              <th className="text-right py-3 px-2 text-gray-400 font-medium">수익률</th>
              <th className="text-right py-3 px-2 text-gray-400 font-medium">3년간 증가</th>
            </tr>
          </thead>
          <tbody>
            {threeYearAnalysis.map((data, index) => {
              const prevData = index > 0 ? threeYearAnalysis[index - 1] : null;
              const threeYearGrowth = prevData ? data.finalAmount - prevData.finalAmount : data.finalAmount - parseNumber(principal);
              
              return (
                <tr 
                  key={data.year} 
                  className={`border-b border-gray-800 hover:bg-white/5 transition-colors ${
                    data.isCurrentTarget ? 'bg-blue-500/10 border-blue-500/20' : 
                    data.isFuture ? 'bg-green-500/5 border-green-500/10' : ''
                  }`}
                >
                  <td className="py-3 px-2">
                    <span className={`font-semibold ${
                      data.isCurrentTarget ? 'text-blue-400' : 
                      data.isFuture ? 'text-green-400' : 'text-white'
                    }`}>
                      {data.year}년차
                    </span>
                    {data.isCurrentTarget && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">목표</span>
                    )}
                    {data.isFuture && (
                      <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">예상</span>
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
                    +₩{threeYearGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 현재 vs 미래 비교 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 rounded-lg border border-blue-500/20">
          <h4 className="text-blue-400 font-semibold mb-2">🎯 현재 목표 ({currentTargetYear}년)</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <strong>최종 금액:</strong> ₩{result.finalAmount.toLocaleString()}</p>
            <p>• <strong>총 수익:</strong> ₩{result.totalInterest.toLocaleString()}</p>
            <p>• <strong>수익률:</strong> {result.returnRate.toFixed(1)}%</p>
            <p>• <strong>투자 배수:</strong> {(result.finalAmount / result.totalContributions).toFixed(2)}x</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-900/20 to-teal-900/20 p-4 rounded-lg border border-green-500/20">
          <h4 className="text-green-400 font-semibold mb-2">🚀 미래 예상 결과 (3년 단위)</h4>
          <div className="space-y-2 text-sm text-gray-300">
            {threeYearAnalysis.filter(data => data.year === currentTargetYear + 3)[0] && (
              <p>• <strong>+3년 후:</strong> ₩{threeYearAnalysis.filter(data => data.year === currentTargetYear + 3)[0].finalAmount.toLocaleString()}</p>
            )}
            {threeYearAnalysis.filter(data => data.year === currentTargetYear + 6)[0] && (
              <p>• <strong>+6년 후:</strong> ₩{threeYearAnalysis.filter(data => data.year === currentTargetYear + 6)[0].finalAmount.toLocaleString()}</p>
            )}
            {threeYearAnalysis.filter(data => data.year === currentTargetYear + 9)[0] && (
              <p>• <strong>+9년 후:</strong> ₩{threeYearAnalysis.filter(data => data.year === currentTargetYear + 9)[0].finalAmount.toLocaleString()}</p>
            )}
            <p className="text-green-400 font-medium">
              ⭐ 3년마다 <strong>기하급수적 성장</strong>을 경험할 수 있습니다!
            </p>
          </div>
        </div>
      </div>

      {/* 3년 단위 인사이트 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 p-4 rounded-lg border border-orange-500/20">
          <h4 className="text-orange-400 font-semibold mb-2">📈 3년 단위 성장 패턴</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• <strong>3년차:</strong> ₩{threeYearAnalysis[0]?.finalAmount.toLocaleString()} (기반 구축)</p>
            {threeYearAnalysis[1] && (
              <p>• <strong>6년차:</strong> ₩{threeYearAnalysis[1]?.finalAmount.toLocaleString()} (성장 시작)</p>
            )}
            {threeYearAnalysis[2] && (
              <p>• <strong>9년차:</strong> ₩{threeYearAnalysis[2]?.finalAmount.toLocaleString()} (가속화)</p>
            )}
            {threeYearAnalysis[3] && (
              <p>• <strong>12년차:</strong> ₩{threeYearAnalysis[3]?.finalAmount.toLocaleString()} (기하급수적 증가)</p>
            )}
            <p className="text-orange-400 font-medium">
              ⚡ 3년마다 증가폭이 급격히 커집니다!
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 p-4 rounded-lg border border-purple-500/20">
          <h4 className="text-purple-400 font-semibold mb-2">💰 3년간 증가 분석</h4>
          <div className="space-y-2 text-sm text-gray-300">
            {threeYearAnalysis.length >= 2 && (
              <>
                <p>• <strong>첫 3년:</strong> ₩{(threeYearAnalysis[0].finalAmount - parseNumber(principal)).toLocaleString()} 증가</p>
                {threeYearAnalysis.length >= 3 && (
                  <p>• <strong>다음 3년:</strong> ₩{(threeYearAnalysis[1].finalAmount - threeYearAnalysis[0].finalAmount).toLocaleString()} 증가</p>
                )}
                {threeYearAnalysis.length >= 4 && (
                  <p>• <strong>그 다음 3년:</strong> ₩{(threeYearAnalysis[2].finalAmount - threeYearAnalysis[1].finalAmount).toLocaleString()} 증가</p>
                )}
              </>
            )}
            <p className="text-purple-400 font-medium">
              💡 3년마다 <strong>증가액이 기하급수적으로 증가</strong>합니다!
            </p>
          </div>
        </div>
      </div>

      {/* 시각적 비교 - 3년 단위 */}
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h4 className="text-white font-semibold mb-4">📊 3년 단위 자산 증가 시각화</h4>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {threeYearAnalysis.map((data) => {
            const maxAmount = Math.max(...threeYearAnalysis.map(p => p.finalAmount));
            const widthPercent = (data.finalAmount / maxAmount) * 100;
            
            return (
              <div key={data.year} className="flex items-center gap-3">
                <div className="w-12 text-right">
                  <span className={`text-sm ${
                    data.isCurrentTarget ? 'text-blue-400 font-bold' : 
                    data.isFuture ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {data.year}년
                  </span>
                </div>
                <div className="flex-1 bg-gray-700 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      data.isCurrentTarget 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : data.isFuture
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
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
                <div className="w-20 text-right">
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

      {/* 미래 투자 시나리오 - 3년 단위 */}
      <div className="mt-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 p-4 rounded-lg border border-cyan-500/20">
        <h4 className="text-cyan-400 font-semibold mb-2">🔮 미래 투자 시나리오 (3년 단위)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-cyan-400 font-medium mb-1">3년 더 투자한다면?</p>
            {threeYearAnalysis.filter(data => data.year === currentTargetYear + 3)[0] && (
              <p className="text-white">
                추가 ₩{(threeYearAnalysis.filter(data => data.year === currentTargetYear + 3)[0].finalAmount - result.finalAmount).toLocaleString()} 수익
              </p>
            )}
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-cyan-400 font-medium mb-1">6년 더 투자한다면?</p>
            {threeYearAnalysis.filter(data => data.year === currentTargetYear + 6)[0] && (
              <p className="text-white">
                추가 ₩{(threeYearAnalysis.filter(data => data.year === currentTargetYear + 6)[0].finalAmount - result.finalAmount).toLocaleString()} 수익
              </p>
            )}
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-cyan-400 font-medium mb-1">9년 더 투자한다면?</p>
            {threeYearAnalysis.filter(data => data.year === currentTargetYear + 9)[0] && (
              <p className="text-white">
                추가 ₩{(threeYearAnalysis.filter(data => data.year === currentTargetYear + 9)[0].finalAmount - result.finalAmount).toLocaleString()} 수익
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 복리 효과 설명 */}
      <div className="mt-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 p-4 rounded-lg border border-yellow-500/20">
        <h4 className="text-yellow-400 font-semibold mb-2">🔥 복리의 마법 (3년 주기)</h4>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• <strong>1-3년:</strong> 월 납입금의 영향이 큼 (기반 구축 단계)</p>
          <p>• <strong>4-6년:</strong> 복리 효과가 본격적으로 나타남 (성장 가속화)</p>
          <p>• <strong>7-9년:</strong> 복리가 월 납입금을 압도하기 시작 (기하급수적 증가)</p>
          <p>• <strong>10년 이후:</strong> 복리 효과가 폭발적으로 증가 (자산 급증)</p>
          <p className="text-yellow-400 font-medium">
            ⭐ <strong>3년마다</strong> 놀라운 변화를 경험할 수 있습니다!
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
              {showPeriodAnalysis ? '3년 단위 분석 숨기기' : '3년 단위 분석 보기'}
            </button>
          </div>
        </div>
      </div>

      {showPeriodAnalysis && renderThreeYearAnalysis()}
    </div>
  );
};

export default CompoundCalculator;