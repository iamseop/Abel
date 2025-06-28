import React, { useState } from 'react';
import Header from './components/Header';
import PortfolioSummary from './components/PortfolioSummary';
import AssetAllocation from './components/AssetAllocation';
import RecentTransactions from './components/RecentTransactions';
import StockList from './components/StockList';
import QuickActions from './components/QuickActions';
import CalculatorTabs from './components/calculators/CalculatorTabs';

function App() {
  const [activeTab, setActiveTab] = useState('portfolio');

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <CalculatorTabs />;
      case 'portfolio':
      default:
        return (
          <>
            <PortfolioSummary />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <AssetAllocation />
                <StockList />
              </div>
              
              <div className="space-y-6">
                <QuickActions />
                <RecentTransactions />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <main className="space-y-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;