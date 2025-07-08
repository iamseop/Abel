import React, { useState } from 'react';
import { Brain, ArrowRight, RotateCcw } from 'lucide-react';
import PersonalityQuestions from './PersonalityQuestions';
import PersonalityResult from './PersonalityResult';

export interface Answer {
  questionId: number;
  answer: string;
  score: number;
}

export interface PersonalityType {
  type: string;
  name: string;
  description: string;
  characteristics: string[];
  recommendations: {
    assetAllocation: { [key: string]: number };
    investmentProducts: string[];
    strategies: string[];
    warnings: string[];
  };
  color: string;
}

const InvestmentPersonalityTest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'test' | 'result'>('intro');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [personalityResult, setPersonalityResult] = useState<PersonalityType | null>(null);

  const startTest = () => {
    setCurrentStep('test');
    setAnswers([]);
  };

  const completeTest = (testAnswers: Answer[]) => {
    setAnswers(testAnswers);
    const result = calculatePersonalityType(testAnswers);
    setPersonalityResult(result);
    setCurrentStep('result');
  };

  const resetTest = () => {
    setCurrentStep('intro');
    setAnswers([]);
    setPersonalityResult(null);
  };

  const calculatePersonalityType = (answers: Answer[]): PersonalityType => {
    // 각 차원별 점수 계산
    const riskTolerance = answers.filter(a => [1, 5, 9].includes(a.questionId))
      .reduce((sum, a) => sum + a.score, 0) / 3;
    
    const timeHorizon = answers.filter(a => [2, 6, 10].includes(a.questionId))
      .reduce((sum, a) => sum + a.score, 0) / 3;
    
    const knowledgeLevel = answers.filter(a => [3, 7, 11].includes(a.questionId))
      .reduce((sum, a) => sum + a.score, 0) / 3;
    
    const emotionalControl = answers.filter(a => [4, 8, 12].includes(a.questionId))
      .reduce((sum, a) => sum + a.score, 0) / 3;

    // 성향 유형 결정
    const avgScore = (riskTolerance + timeHorizon + knowledgeLevel + emotionalControl) / 4;

    if (avgScore >= 4.5) {
      return {
        type: 'AGGRESSIVE',
        name: '공격적 투자자 (AGGRESSIVE)',
        description: '높은 수익을 위해 높은 위험을 감수할 수 있는 투자자입니다. 장기적 관점에서 적극적인 투자를 선호합니다.',
        characteristics: [
          '높은 위험 감수 능력',
          '장기 투자 지향',
          '시장 변동성에 대한 높은 내성',
          '적극적인 투자 성향',
          '높은 수익률 추구'
        ],
        recommendations: {
          assetAllocation: {
            '주식': 70,
            '채권': 20,
            '대안투자': 10
          },
          investmentProducts: [
            '성장주 펀드',
            '신흥국 주식',
            '섹터별 ETF',
            'REIT',
            '암호화폐 (소액)'
          ],
          strategies: [
            '장기 보유 전략',
            '달러 코스트 애버리징',
            '성장주 중심 포트폴리오',
            '글로벌 분산 투자',
            '정기적 리밸런싱'
          ],
          warnings: [
            '과도한 집중 투자 주의',
            '감정적 매매 금지',
            '레버리지 투자 신중 고려',
            '정기적인 포트폴리오 점검 필요'
          ]
        },
        color: 'from-red-500 to-orange-500'
      };
    } else if (avgScore >= 3.5) {
      return {
        type: 'GROWTH',
        name: '성장 추구형 (GROWTH)',
        description: '적당한 위험을 감수하며 꾸준한 성장을 추구하는 균형잡힌 투자자입니다.',
        characteristics: [
          '중간 수준의 위험 감수',
          '성장과 안정성의 균형 추구',
          '중장기 투자 선호',
          '합리적 투자 판단',
          '꾸준한 수익률 추구'
        ],
        recommendations: {
          assetAllocation: {
            '주식': 60,
            '채권': 30,
            '현금성 자산': 10
          },
          investmentProducts: [
            '혼합형 펀드',
            '배당주',
            '인덱스 펀드',
            '회사채',
            '금융 상품'
          ],
          strategies: [
            '분산 투자',
            '정기 적립식 투자',
            '배당 재투자',
            '리밸런싱',
            '목표 수익률 설정'
          ],
          warnings: [
            '시장 타이밍 투자 지양',
            '과도한 거래 빈도 주의',
            '감정적 판단 배제',
            '장기 관점 유지'
          ]
        },
        color: 'from-blue-500 to-purple-500'
      };
    } else if (avgScore >= 2.5) {
      return {
        type: 'BALANCED',
        name: '균형 추구형 (BALANCED)',
        description: '안정성과 수익성의 균형을 중시하는 신중한 투자자입니다.',
        characteristics: [
          '안정성 중시',
          '적당한 수익률 추구',
          '위험 회피 성향',
          '신중한 투자 결정',
          '원금 보존 중시'
        ],
        recommendations: {
          assetAllocation: {
            '주식': 40,
            '채권': 50,
            '현금성 자산': 10
          },
          investmentProducts: [
            '안정형 펀드',
            '우량주',
            '국채',
            '정기예금',
            'MMF'
          ],
          strategies: [
            '안정적 분산 투자',
            '정기 적립',
            '원금 보존 우선',
            '보수적 리밸런싱',
            '단계적 투자'
          ],
          warnings: [
            '인플레이션 리스크 고려',
            '과도한 보수성 주의',
            '기회비용 인식',
            '장기 목표 설정 필요'
          ]
        },
        color: 'from-green-500 to-teal-500'
      };
    } else {
      return {
        type: 'CONSERVATIVE',
        name: '안정 추구형 (CONSERVATIVE)',
        description: '원금 보존을 최우선으로 하는 매우 보수적인 투자자입니다.',
        characteristics: [
          '원금 보존 최우선',
          '매우 낮은 위험 선호',
          '안정적 수익 추구',
          '보수적 투자 성향',
          '확실성 중시'
        ],
        recommendations: {
          assetAllocation: {
            '채권': 60,
            '현금성 자산': 30,
            '주식': 10
          },
          investmentProducts: [
            '정기예금',
            '국채',
            '안전자산 펀드',
            'CMA',
            '원금보장형 상품'
          ],
          strategies: [
            '원금 보장 투자',
            '단기 투자 중심',
            '안전 자산 위주',
            '계단식 투자',
            '유동성 확보'
          ],
          warnings: [
            '인플레이션 대비 필요',
            '너무 보수적인 투자 지양',
            '장기 목표 고려',
            '기회비용 인식 필요'
          ]
        },
        color: 'from-gray-500 to-slate-500'
      };
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <div className="glass-card p-4 sm:p-6 lg:p-8 text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">투자 성향 테스트</h1>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed">
                MBTI처럼 당신의 투자 성향을 분석하여<br className="hidden sm:block" />
                맞춤형 투자 전략을 제안해드립니다.
              </p>
            </div>

            <div className="bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-xl mb-6 sm:mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <p className="text-blue-400 font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">소요 시간</p>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg">약 5분</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">질문 수</p>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg">12개</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">결과</p>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg">4가지 투자 유형</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>위험 감수 능력 분석</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>투자 기간 및 목표 파악</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>투자 지식 수준 평가</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>맞춤형 포트폴리오 추천</span>
              </div>
            </div>

            <button
              onClick={startTest}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2 mx-auto text-sm sm:text-base"
            >
              테스트 시작하기
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        );

      case 'test':
        return <PersonalityQuestions onComplete={completeTest} />;

      case 'result':
        return personalityResult ? (
          <PersonalityResult 
            result={personalityResult} 
            onReset={resetTest}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">투자 성향 분석</h2>
        </div>
        
        {currentStep !== 'intro' && (
          <button
            onClick={resetTest}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm sm:text-base"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            다시 시작
          </button>
        )}
      </div>

      {renderContent()}
    </div>
  );
};

export default InvestmentPersonalityTest;