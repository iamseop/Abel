import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Percent } from 'lucide-react';

const InvestmentCalculator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState<string>('10000000');
  const [finalValue, setFinalValue] = useState<string>('15000000');
  const [investmentPeriod, setInvestmentPeriod] = useState<string>('5');
  const [calculationType, setCalculationType] = useState<'return' | 'final' | 'time'>('return');

  const calculateInvestment = () => {
    const initial = parseFloat(initialInvestment) || 0;
    const final = parseFloat(finalValue) || 0;
    const period = parseFloat(investmentPeriod) || 0;

    if (calculationType === 'return') {
      // 수익률 계산
      const totalReturn = ((final - initial) / initial) * 100;
      const annualReturn = Math.pow(final / initial, 1 / period) - 1;
      return {
        totalReturn,
        annualReturn: annualReturn * 100,
        profit: final - initial
      };
    } else if (calculationType === 'final') {
      // 최종 가치 계산 (수익률을 입력받아야 함)
      const rate = parseFloat(finalValue) / 100; // finalValue를 수익률로 사용
      const calculatedFinal = initial * Math.pow(1 + rate, period);
      return {
        calculatedFinal,
        profit: calculatedFinal - initial,
        totalReturn: ((calculatedFinal - initial) / initial) * 100
      };
    } else {
      // 투자 기간 계산
      const rate = parseFloat(finalValue) / 100; // finalValue를 수익률로 사용
      const calculatedTime = Math.log(final / initial) / Math.log(1 + rate);
      return {
        calculatedTime,
        annualReturn: rate * 100
      };
    }
  };

  const result = calculateInvestment();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">투자 수익률 계산기</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              계산 유형
            </label>
            <select
              value={calculationType}
              onChange={(e) => setCalculationType(e.target.value as 'return' | 'final' | 'time')}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="return">수익률 계산</option>
              <option value="final">최종 가치 계산</option>
              <option value="time">투자 기간 계산</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              초기 투자금 (원)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="10,000,000"
              />
            </div>
          </div>

          {calculationType === 'return' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                최종 가치 (원)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="15,000,000"
                />
              </div>
            </div>
          )}

          {calculationType === 'final' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                연 수익률 (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  step="0.1"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="8"
                />
              </div>
            </div>
          )}

          {calculationType === 'time' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  목표 금액 (원)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={finalValue}
                    onChange={(e) => setFinalValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="20,000,000"
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
                    type="number"
                    value="8"
                    onChange={(e) => setFinalValue(e.target.value)}
                    step="0.1"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    placeholder="8"
                  />
                </div>
              </div>
            </>
          )}

          {calculationType !== 'time' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                투자 기간 (년)
              </label>
              <input
                type="number"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="5"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-xl">
            <h3 className="text-white font-bold text-lg mb-4">계산 결과</h3>
            <div className="space-y-4">
              {calculationType === 'return' && (
                <>
                  <div>
                    <p className="text-green-100 text-sm">총 수익률</p>
                    <p className="text-white text-2xl font-bold">
                      {result.totalReturn?.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">연 평균 수익률</p>
                    <p className="text-white text-xl font-bold">
                      {result.annualReturn?.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">총 수익</p>
                    <p className="text-green-300 text-lg font-semibold">
                      ₩{result.profit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </>
              )}

              {calculationType === 'final' && (
                <>
                  <div>
                    <p className="text-green-100 text-sm">예상 최종 가치</p>
                    <p className="text-white text-2xl font-bold">
                      ₩{result.calculatedFinal?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">예상 수익</p>
                    <p className="text-green-300 text-lg font-semibold">
                      ₩{result.profit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">총 수익률</p>
                    <p className="text-white text-lg">
                      {result.totalReturn?.toFixed(2)}%
                    </p>
                  </div>
                </>
              )}

              {calculationType === 'time' && (
                <>
                  <div>
                    <p className="text-green-100 text-sm">필요 투자 기간</p>
                    <p className="text-white text-2xl font-bold">
                      {result.calculatedTime?.toFixed(1)}년
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">연 수익률</p>
                    <p className="text-white text-lg">
                      {result.annualReturn?.toFixed(2)}%
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h4 className="text-white font-semibold mb-4">투자 분석</h4>
            <div className="space-y-3">
              {calculationType === 'return' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">투자 배수</span>
                    <span className="text-white">
                      {(parseFloat(finalValue) / parseFloat(initialInvestment)).toFixed(2)}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">연 평균 수익</span>
                    <span className="text-white">
                      ₩{((result.profit || 0) / parseFloat(investmentPeriod)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </>
              )}
              {calculationType === 'final' && (
                <div className="flex justify-between">
                  <span className="text-gray-400">투자 배수</span>
                  <span className="text-white">
                    {((result.calculatedFinal || 0) / parseFloat(initialInvestment)).toFixed(2)}x
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h4 className="text-white font-semibold mb-4">투자 팁</h4>
            <div className="space-y-2 text-sm">
              <p className="text-blue-400">• 장기 투자일수록 복리 효과가 커집니다</p>
              <p className="text-blue-400">• 분산 투자로 리스크를 줄이세요</p>
              <p className="text-blue-400">• 정기적인 포트폴리오 리밸런싱을 고려하세요</p>
              <p className="text-yellow-400">• 과거 수익률이 미래를 보장하지 않습니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;