import React, { useState } from 'react';
import { PiggyBank, Calendar, DollarSign, Target } from 'lucide-react';

const RetirementCalculator: React.FC = () => {
  const [currentAge, setCurrentAge] = useState<string>('30');
  const [retirementAge, setRetirementAge] = useState<string>('65');
  const [currentSavings, setCurrentSavings] = useState<string>('5,000,000');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('500,000');
  const [expectedReturn, setExpectedReturn] = useState<string>('7');
  const [retirementGoal, setRetirementGoal] = useState<string>('3,000,000,000');

  // 숫자에 쉼표 추가하는 함수
  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/[^\d]/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 쉼표 제거하고 숫자만 반환하는 함수
  const parseNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  // 입력값 변경 핸들러
  const handleCurrentSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setCurrentSavings(formatted);
  };

  const handleMonthlyContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setMonthlyContribution(formatted);
  };

  const handleRetirementGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setRetirementGoal(formatted);
  };

  const calculateRetirement = () => {
    const age = parseFloat(currentAge) || 0;
    const retAge = parseFloat(retirementAge) || 0;
    const savings = parseNumber(currentSavings);
    const monthly = parseNumber(monthlyContribution);
    const rate = (parseFloat(expectedReturn) || 0) / 100;
    const goal = parseNumber(retirementGoal);
    
    const yearsToRetirement = retAge - age;
    const monthlyRate = rate / 12;
    const totalMonths = yearsToRetirement * 12;

    // 현재 저축액의 미래 가치
    const futureValueCurrentSavings = savings * Math.pow(1 + rate, yearsToRetirement);
    
    // 월 납입금의 미래 가치 (연금 공식)
    const futureValueMonthlyContributions = monthly * 
      (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    
    const totalRetirementFund = futureValueCurrentSavings + futureValueMonthlyContributions;
    const shortfall = Math.max(0, goal - totalRetirementFund);
    const surplus = Math.max(0, totalRetirementFund - goal);

    // 목표 달성을 위한 필요 월 납입금
    const requiredMonthlyForGoal = shortfall > 0 ? 
      (goal - futureValueCurrentSavings) * monthlyRate / 
      (Math.pow(1 + monthlyRate, totalMonths) - 1) : 0;

    return {
      yearsToRetirement,
      totalRetirementFund,
      shortfall,
      surplus,
      requiredMonthlyForGoal,
      monthlyIncomeAt4Percent: totalRetirementFund * 0.04 / 12
    };
  };

  const result = calculateRetirement();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <PiggyBank className="w-6 h-6 text-blue-400" />
        <h2 className="text-lg font-bold text-white">은퇴 계획 계산기</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                현재 나이
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                은퇴 나이
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="65"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              현재 저축액 (원)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={currentSavings}
                onChange={handleCurrentSavingsChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="5,000,000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              월 저축액 (원)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={monthlyContribution}
                onChange={handleMonthlyContributionChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="500,000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              예상 연 수익률 (%)
            </label>
            <input
              type="text"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="7"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-2">
              은퇴 목표 금액 (원)
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={retirementGoal}
                onChange={handleRetirementGoalChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                placeholder="3,000,000,000"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl">
            <h3 className="text-base font-bold text-lg mb-4">은퇴 계획 결과</h3>
            <div className="space-y-4">
              <div>
                <p className="text-purple-100 text-xs">은퇴까지 남은 기간</p>
                <p className="text-white text-xl font-bold">{result.yearsToRetirement}년</p>
              </div>
              <div>
                <p className="text-purple-100 text-xs">예상 은퇴 자금</p>
                <p className="text-white text-lg font-bold">
                  ₩{result.totalRetirementFund.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              {result.surplus > 0 ? (
                <div>
                  <p className="text-purple-100 text-xs">목표 초과 달성</p>
                  <p className="text-green-300 text-base font-semibold">
                    +₩{result.surplus.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-purple-100 text-xs">목표 부족 금액</p>
                  <p className="text-red-300 text-base font-semibold">
                    -₩{result.shortfall.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h4 className="text-white font-semibold mb-4">은퇴 후 생활</h4>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-xs">4% 룰 기준 월 소득</p>
                <p className="text-white text-base font-semibold">
                  ₩{result.monthlyIncomeAt4Percent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              {result.shortfall > 0 && (
                <div>
                  <p className="text-gray-400 text-xs">목표 달성 필요 월 저축액</p>
                  <p className="text-yellow-400 text-base font-semibold">
                    ₩{result.requiredMonthlyForGoal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h4 className="text-white font-semibold mb-4">추천 사항</h4>
            <div className="space-y-2 text-xs">
              {result.surplus > 0 ? (
                <p className="text-green-400">✓ 현재 계획으로 목표를 달성할 수 있습니다!</p>
              ) : (
                <>
                  <p className="text-yellow-400">• 월 저축액을 늘리거나 은퇴 나이를 늦춰보세요</p>
                  <p className="text-yellow-400">• 더 높은 수익률의 투자 상품을 고려해보세요</p>
                </>
              )}
              <p className="text-blue-400">• 인플레이션을 고려한 실질 구매력을 계산해보세요</p>
              <p className="text-blue-400">• 정기적으로 계획을 검토하고 조정하세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;