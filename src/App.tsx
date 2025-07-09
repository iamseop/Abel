import React, { useState } from 'react';
import Header from './components/Header';
import PortfolioSummary from './components/PortfolioSummary';
import AssetAllocation from './components/AssetAllocation';
import StockList from './components/StockList';
import HoldingsList from './components/HoldingsList';
import QuickActions from './components/QuickActions';
import CalculatorTabs from './components/calculators/CalculatorTabs';
import InvestmentPersonalityTest from './components/personality/InvestmentPersonalityTest';
import WatchlistPage from './components/WatchlistPage';
import SimulationPage from './components/SimulationPage';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('portfolio');

  const renderContent = () => {
    switch (activeTab) {
      case 'watchlist':
        return <WatchlistPage />;
      case 'simulation':
        return <SimulationPage />;
      case 'calculator':
        return <CalculatorTabs />;
      case 'personality':
        return <InvestmentPersonalityTest />;
      case 'portfolio':
      default:
        return (
          <>
            <PortfolioSummary />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
              <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                <AssetAllocation />
                <HoldingsList />
              </div>
              <div className="space-y-4 sm:space-y-6">
                <QuickActions />
                <StockList />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 p-3 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <main className="space-y-4 sm:space-y-6">
            {renderContent()}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;