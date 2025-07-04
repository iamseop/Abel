import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Percent, Calculator } from 'lucide-react';

const CompoundCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<string>('1,000,000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('100,000');
  const [annualRate, setAnnualRate] = useState<string>('7');
  const [years, setYears] = useState<string>('10');
  const [compoundFrequency, setCompoundFrequency] = useState<string>('12');
  const [showCalculationProcess, setShowCalculationProcess] = useState(false);

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

  const result = calculateCompound();

  const renderCalculationProcess = () => (
    <div className="glass-card p-6 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-white">계산 과정</h3>
      </div>

      <div className="space-y-6">
        {/* 입력값 정리 */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-white font-semibold mb-3">📊 입력값 정리</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">초기 투자금 (P):</span>
              <span className="text-white font-mono">₩{result.p.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">월 납입금 (PMT):</span>
              <span className="text-white font-mono">₩{result.pmt.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">연 이율 (r):</span>
              <span className="text-white font-mono">{(result.r * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">투자 기간 (t):</span>
              <span className="text-white font-mono">{result.t}년</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">복리 주기 (n):</span>
              <span className="text-white font-mono">연 {result.n}회</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">월 이율:</span>
              <span className="text-white font-mono">{(result.monthlyRate * 100).toFixed(4)}%</span>
            </div>
          </div>
        </div>

        {/* 1단계: 원금 복리 계산 */}
        <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-3">🔢 1단계: 원금 복리 계산</h4>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-800 p-3 rounded font-mono text-center">
              <p className="text-gray-300 mb-2">복리 공식: A = P × (1 + r/n)^(n×t)</p>
              <p className="text-white">
                A = {result.p.toLocaleString()} × (1 + {result.r.toFixed(4)}/{result.n})^({result.n}×{result.t})
              </p>
              <p className="text-white">
                A = {result.p.toLocaleString()} × (1 + {(result.r/result.n).toFixed(6)})^{(result.n * result.t)}
              </p>
              <p className="text-white">
                A = {result.p.toLocaleString()} × ({(1 + result.r/result.n).toFixed(6)})^{(result.n * result.t)}
              </p>
              <p className="text-blue-400 font-bold text-lg">
                A = ₩{result.compoundAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <p className="text-gray-300">
              원금 {result.p.toLocaleString()}원이 {result.t}년 후 <span className="text-blue-400 font-semibold">₩{result.compoundAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>가 됩니다.
            </p>
          </div>
        </div>

        {/* 2단계: 월 납입금 복리 계산 */}
        <div className="bg-green-900/20 border border-green-500/20 p-4 rounded-lg">
          <h4 className="text-green-400 font-semibold mb-3">💰 2단계: 월 납입금 복리 계산</h4>
          <div className="space-y-2 text-sm">
            <div className="bg-gray-800 p-3 rounded font-mono text-center">
              <p className="text-gray-300 mb-2">연금 공식: FV = PMT × [(1 + r)^n - 1] / r</p>
              <p className="text-white">
                FV = {result.pmt.toLocaleString()} × [(1 + {result.monthlyRate.toFixed(6)})^{(12 * result.t)} - 1] / {result.monthlyRate.toFixed(6)}
              </p>
              <p className="text-white">
                FV = {result.pmt.toLocaleString()} × [({(1 + result.monthlyRate).toFixed(6)})^{(12 * result.t)} - 1] / {result.monthlyRate.toFixed(6)}
              </p>
              <p className="text-white">
                FV = {result.pmt.toLocaleString()} × [{Math.pow(1 + result.monthlyRate, 12 * result.t).toFixed(4)} - 1] / {result.monthlyRate.toFixed(6)}
              </p>
              <p className="text-green-400 font-bold text-lg">
                FV = ₩{result.monthlyCompound.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <p className="text-gray-300">
              월 {result.pmt.toLocaleString()}원씩 {result.t}년간 납입하면 <span className="text-green-400 font-semibold">₩{result.monthlyCompound.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>가 됩니다.
            </p>
          </div>
        </div>

        {/* 3단계: 최종 결과 */}
        <div className="bg-purple-900/20 border border-purple-500/20 p-4 rounded-lg">
          <h4 className="text-purple-400 font-semibold mb-3">🎯 3단계: 최종 결과</h4>
          <div className="space-y-3">
            <div className="bg-gray-800 p-3 rounded">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-sm">원금 복리</p>
                  <p className="text-blue-400 font-bold">₩{result.compoundAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">월납입 복리</p>
                  <p className="text-green-400 font-bold">₩{result.monthlyCompound.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">최종 금액</p>
                  <p className="text-purple-400 font-bold text-xl">₩{result.finalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded">
              <h5 className="text-white font-semibold mb-2">📈 수익 분석</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">총 투자금:</span>
                  <span className="text-white">₩{result.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">총 수익:</span>
                  <span className="text-green-400">₩{result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">수익률:</span>
                  <span className="text-green-400">{result.returnRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded">
              <p className="text-yellow-400 text-sm">
                💡 <strong>복리의 힘:</strong> 단순히 원금과 월납입금을 합한 {result.totalContributions.toLocaleString()}원이 
                복리 효과로 인해 {result.finalAmount.toLocaleString()}원이 되어 
                <strong> {result.totalInterest.toLocaleString()}원의 추가 수익</strong>을 얻게 됩니다!
              </p>
            </div>
          </div>
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

            <button
              onClick={() => setShowCalculationProcess(!showCalculationProcess)}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              {showCalculationProcess ? '계산 과정 숨기기' : '계산 과정 보기'}
            </button>
          </div>
        </div>
      </div>

      {showCalculationProcess && renderCalculationProcess()}
    </div>
  );
};

export default CompoundCalculator;