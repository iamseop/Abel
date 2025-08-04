import React, { useState } from 'react';
import { Calculator, TrendingUp, PiggyBank, BarChart3 } from 'lucide-react';
import CompoundCalculator from './CompoundCalculator';
import RetirementCalculator from './RetirementCalculator';
import InvestmentCalculator from './InvestmentCalculator';

const CalculatorTabs: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState('compound');

  const calculators = [
    {
      id: 'compound',
      label: '복리 계산기',
      icon: Calculator,
      component: CompoundCalculator
    },
    {
      id: 'investment',
      label: '투자 수익률',
      icon: BarChart3,
      component: InvestmentCalculator
    },
    {
      id: 'retirement',
      label: '은퇴 계획',
      icon: PiggyBank,
      component: RetirementCalculator
    }
  ];

  const ActiveComponent = calculators.find(calc => calc.id === activeCalculator)?.component || CompoundCalculator;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {calculators.map((calculator) => {
          const IconComponent = calculator.icon;
          return (
            <button
              key={calculator.id}
              onClick={() => setActiveCalculator(calculator.id)}
              className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                activeCalculator === calculator.id
                  ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)] shadow-lg'
                  : 'bg-[var(--input-background)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--button-default-hover-bg)]'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {calculator.label}
            </button>
          );
        })}
      </div>

      <ActiveComponent />
    </div>
  );
};

export default CalculatorTabs;