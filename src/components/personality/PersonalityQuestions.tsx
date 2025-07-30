import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Answer } from './InvestmentPersonalityTest';

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    score: number;
  }[];
  category: 'risk' | 'time' | 'knowledge' | 'emotion';
}

interface PersonalityQuestionsProps {
  onComplete: (answers: Answer[]) => void;
}

const questions: Question[] = [
  {
    id: 1,
    category: 'risk',
    question: '투자에서 가장 중요하게 생각하는 것은?',
    options: [
      { text: '원금 보존이 최우선', score: 1 },
      { text: '안정적인 수익', score: 2 },
      { text: '적당한 위험과 수익의 균형', score: 3 },
      { text: '높은 수익을 위한 위험 감수', score: 4 },
      { text: '최대한 높은 수익률 추구', score: 5 }
    ]
  },
  {
    id: 2,
    category: 'time',
    question: '주로 어느 정도 기간의 투자를 계획하시나요?',
    options: [
      { text: '1년 이내', score: 1 },
      { text: '1-3년', score: 2 },
      { text: '3-5년', score: 3 },
      { text: '5-10년', score: 4 },
      { text: '10년 이상', score: 5 }
    ]
  },
  {
    id: 3,
    category: 'knowledge',
    question: '본인의 투자 지식 수준은?',
    options: [
      { text: '투자 초보자', score: 1 },
      { text: '기본적인 지식 보유', score: 2 },
      { text: '어느 정도 경험 있음', score: 3 },
      { text: '상당한 지식과 경험', score: 4 },
      { text: '전문가 수준', score: 5 }
    ]
  },
  {
    id: 4,
    category: 'emotion',
    question: '투자 손실이 발생했을 때 어떻게 반응하시나요?',
    options: [
      { text: '즉시 매도하고 안전한 곳으로 이동', score: 1 },
      { text: '불안해하며 자주 확인', score: 2 },
      { text: '걱정되지만 기다려봄', score: 3 },
      { text: '장기적 관점에서 침착하게 대응', score: 4 },
      { text: '추가 매수 기회로 인식', score: 5 }
    ]
  },
  {
    id: 5,
    category: 'risk',
    question: '포트폴리오에서 주식 비중은 어느 정도가 적당하다고 생각하시나요?',
    options: [
      { text: '0-20%', score: 1 },
      { text: '20-40%', score: 2 },
      { text: '40-60%', score: 3 },
      { text: '60-80%', score: 4 },
      { text: '80-100%', score: 5 }
    ]
  },
  {
    id: 6,
    category: 'time',
    question: '은퇴 자금 마련을 위한 투자라면?',
    options: [
      { text: '은퇴 5년 전부터 시작', score: 1 },
      { text: '은퇴 10년 전부터 시작', score: 2 },
      { text: '은퇴 20년 전부터 시작', score: 3 },
      { text: '은퇴 30년 전부터 시작', score: 4 },
      { text: '가능한 한 빨리 시작', score: 5 }
    ]
  },
  {
    id: 7,
    category: 'knowledge',
    question: '새로운 투자 상품을 접할 때?',
    options: [
      { text: '잘 알려진 상품만 선택', score: 1 },
      { text: '충분히 검토 후 신중하게 결정', score: 2 },
      { text: '기본 정보 확인 후 투자', score: 3 },
      { text: '적극적으로 학습하고 투자', score: 4 },
      { text: '새로운 기회를 먼저 시도', score: 5 }
    ]
  },
  {
    id: 8,
    category: 'emotion',
    question: '시장이 크게 하락할 때 어떻게 하시겠습니까?',
    options: [
      { text: '모든 투자를 중단', score: 1 },
      { text: '안전 자산으로 이동', score: 2 },
      { text: '현 상태 유지', score: 3 },
      { text: '하락장을 기회로 활용', score: 4 },
      { text: '적극적으로 추가 투자', score: 5 }
    ]
  },
  {
    id: 9,
    category: 'risk',
    question: '1년 동안 투자 손실을 어느 정도까지 감수할 수 있나요?',
    options: [
      { text: '손실 불가', score: 1 },
      { text: '5% 이내', score: 2 },
      { text: '10% 이내', score: 3 },
      { text: '20% 이내', score: 4 },
      { text: '30% 이상도 가능', score: 5 }
    ]
  },
  {
    id: 10,
    category: 'time',
    question: '투자 수익을 언제 사용할 계획인가요?',
    options: [
      { text: '언제든 필요할 때', score: 1 },
      { text: '2-3년 내', score: 2 },
      { text: '5년 후', score: 3 },
      { text: '10년 후', score: 4 },
      { text: '은퇴 후', score: 5 }
    ]
  },
  {
    id: 11,
    category: 'knowledge',
    question: '투자 정보는 주로 어디서 얻으시나요?',
    options: [
      { text: '은행 직원 추천', score: 1 },
      { text: '인터넷 검색', score: 2 },
      { text: '투자 서적이나 강의', score: 3 },
      { text: '전문가 리포트 분석', score: 4 },
      { text: '직접 분석하고 연구', score: 5 }
    ]
  },
  {
    id: 12,
    category: 'emotion',
    question: '투자 성과를 얼마나 자주 확인하시나요?',
    options: [
      { text: '매일 여러 번', score: 1 },
      { text: '매일 한 번', score: 2 },
      { text: '주 1-2회', score: 3 },
      { text: '월 1-2회', score: 4 },
      { text: '분기별 또는 그 이상', score: 5 }
    ]
  }
];

const PersonalityQuestions: React.FC<PersonalityQuestionsProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (score: number, text: string) => {
    setSelectedOption(score);
    
    const newAnswer: Answer = {
      questionId: questions[currentQuestion].id,
      answer: text,
      score
    };

    const updatedAnswers = [...answers.filter(a => a.questionId !== questions[currentQuestion].id), newAnswer];
    setAnswers(updatedAnswers);
  };

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      onComplete(answers);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers.find(a => a.questionId === questions[currentQuestion - 1].id);
      setSelectedOption(prevAnswer?.score || null);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];
  const isAnswered = selectedOption !== null;

  return (
    <div className="glass-card p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">진행률</span>
          <span className="text-xs text-gray-400">{currentQuestion + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-purple-400 font-medium">
            Q{currentQuestion + 1}
          </span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-4 sm:mb-6 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option.score, option.text)}
            className={`w-full p-3 sm:p-4 text-left rounded-xl transition-all duration-200 border-2 ${
              selectedOption === option.score
                ? 'border-purple-500 bg-purple-500/25 text-white'
                : 'border-gray-600 bg-gray-800/70 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center ${
                selectedOption === option.score
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-600'
              }`}>
                {selectedOption === option.score && (
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
              </div>
              <span className="font-medium text-xs sm:text-sm">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors disabled:cursor-not-allowed text-sm sm:text-base"
        >
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          이전
        </button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index < currentQuestion
                  ? 'bg-purple-500'
                  : index === currentQuestion
                  ? 'bg-purple-400'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={!isAnswered}
          className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {currentQuestion === questions.length - 1 ? '결과 보기' : '다음'}
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export default PersonalityQuestions;