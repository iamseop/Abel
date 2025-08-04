import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { cleanNumericInput, formatNumber, formatCurrencyNoDecimals, formatPercentage, parseNumber } from '../../utils/formatters';

const InvestmentCalculator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState<string>('10000000'); // 쉼표 없는 초기값
  const [finalValue, setFinalValue] = useState<string>('15000000'); // 쉼표 없는 초기값
  const [investmentPeriod, setInvestmentPeriod] = useState<string>('5');
  const [calculationType, setCalculationType] = useState<'return' | 'final' | 'time'>('return');

  // 입력값 변경 핸들러
  const handleInitialInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialInvestment(cleanNumericInput(e.target.value));
  };

  const handleFinalValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinalValue(cleanNumericInput(e.target.value));
  };

  const calculateInvestment = () => {
    const initial = parseNumber(initialInvestment);
    const final = parseNumber(finalValue);
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
      const rate = final / 100; // finalValue를 수익률로 사용
      const calculatedFinal = initial * Math.pow(1 + rate, period);
      return {
        calculatedFinal,
        profit: calculatedFinal - initial,
        totalReturn: ((calculatedFinal - initial) / initial) * 100
      };
    } else {
      // 투자 기간 계산
      const rate = final / 100; // finalValue를 수익률로 사용
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
        <BarChart3 className="w-6 h-6 text-[var(--text-accent-blue)]" />
        <h2 className="text-lg font-bold text-[var(--text-primary)]">투자 수익률 계산기</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              계산 유형
            </label>
            <select
              value={calculationType}
              onChange={(e) => setCalculationType(e.target.value as 'return' | 'final' | 'time')}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none"
            >
              <option value="return">수익률 계산</option>
              <option value="final">최종 가치 계산</option>
              <option value="time">투자 기간 계산</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
              초기 투자금 (원)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={formatNumber(initialInvestment)} // 쉼표 추가하여 표시
                onChange={handleInitialInvestmentChange}
                className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                placeholder="10,000,000"
              />
            </div>
          </div>

          {calculationType === 'return' && (
            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                최종 가치 (원)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={formatNumber(finalValue)} // 쉼표 추가하여 표시
                  onChange={handleFinalValueChange}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                  placeholder="15,000,000"
                />
              </div>
            </div>
          )}

          {calculationType === 'final' && (
            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                연 수익률 (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  value={finalValue}
                  onChange={handleFinalValueChange}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                  placeholder="8"
                />
              </div>
            </div>
          )}

          {calculationType === 'time' && (
            <>
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                  목표 금액 (원)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                  <input
                    type="text"
                    value={formatNumber(finalValue)} // 쉼표 추가하여 표시
                    onChange={handleFinalValueChange}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                    placeholder="20,000,000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                  연 수익률 (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                  <input
                    type="text"
                    value="8"
                    onChange={handleFinalValueChange}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                    placeholder="8"
                  />
                </div>
              </div>
            </>
          )}

          {calculationType !== 'time' && (
            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">
                투자 기간 (년)
              </label>
              <input
                type="text"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(cleanNumericInput(e.target.value))}
                className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                placeholder="5"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div 
            className="p-6 rounded-xl"
            style={{ background: 'linear-gradient(to right, var(--gradient-investment-start), var(--gradient-investment-end))' }}
          >
            <h3 className="text-base font-bold text-white mb-4">계산 결과</h3>
            <div className="space-y-3 sm:space-y-4">
              {calculationType === 'return' && (
                <>
                  <div>
                    <p className="text-green-100 text-xs">총 수익률</p>
                    <p className="text-white text-xl font-bold">
                      {formatPercentage(result.totalReturn || 0, 2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-xs">연 평균 수익률</p>
                    <p className="text-white text-lg font-bold">
                      {formatPercentage(result.annualReturn || 0, 2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-xs">총 수익</p>
                    <p className="text-green-300 text-base font-semibold">
                      ₩{formatCurrencyNoDecimals(result.profit || 0)}
                    </p>
                  </div>
                </>
              )}

              {calculationType === 'final' && (
                <>
                  <div>
                    <p className="text-green-100 text-xs">예상 최종 가치</p>
                    <p className="text-white text-xl font-bold">
                      ₩{formatCurrencyNoDecimals(result.calculatedFinal || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-xs">예상 수익</p>
                    <p className="text-green-300 text-base font-semibold">
                      ₩{formatCurrencyNoDecimals(result.profit || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-xs">총 수익률</p>
                    <p className="text-white text-base">
                      {formatPercentage(result.totalReturn || 0, 2)}%
                    </p>
                  </div>
                </>
              )}

              {calculationType === 'time' && (
                <>
                  <div>
                    <p className="text-green-100 text-xs">필요 투자 기간</p>
                    <p className="text-white text-xl font-bold">
                      {formatNumber(result.calculatedTime || 0, { maximumFractionDigits: 1 })}년
                    </p>
                  </div>
                  <div>
                    <p className="text-green-100 text-xs">연 수익률</p>
                    <p className="text-white text-base">
                      {formatPercentage(result.annualReturn || 0, 2)}%
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-[var(--input-background)] p-6 rounded-xl">
            <h4 className="text-[var(--text-primary)] font-semibold mb-4">투자 분석</h4>
            <div className="space-y-3">
              {calculationType === 'return' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)] text-xs">투자 배수</span>
                    <span className="text-[var(--text-primary)] text-xs">
                      {formatNumber(parseNumber(finalValue) / parseNumber(initialInvestment), { maximumFractionDigits: 2 })}x
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)] text-xs">연 평균 수익</span>
                    <span className="text-[var(--text-primary)] text-xs">
                      ₩{formatCurrencyNoDecimals((result.profit || 0) / parseFloat(investmentPeriod))}
                    </span>
                  </div>
                </>
              )}
              {calculationType === 'final' && (
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)] text-xs">투자 배수</span>
                  <span className="text-[var(--text-primary)] text-xs">
                    {formatNumber((result.calculatedFinal || 0) / parseNumber(initialInvestment), { maximumFractionDigits: 2 })}x
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[var(--input-background)] p-6 rounded-xl">
            <h4 className="text-[var(--text-primary)] font-semibold mb-4">투자 팁</h4>
            <div className="space-y-2 text-xs">
              <p className="text-[var(--text-accent-blue)]">• 장기 투자일수록 복리 효과가 커집니다</p>
              <p className="text-[var(--text-accent-blue)]">• 분산 투자로 리스크를 줄이세요</p>
              <p className="text-[var(--text-accent-blue)]">• 정기적인 포트폴리오 리밸런싱을 고려하세요</p>
              <p className="text-[var(--text-accent-yellow)]">• 과거 수익률이 미래를 보장하지 않습니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;