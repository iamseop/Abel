import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      <Header />
      
      <div className="flex-1 p-3 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <main className="space-y-4 sm:space-y-6">
            <Routes>
              <Route path="/" element={
                <>
                  <PortfolioSummary />
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* 왼쪽 컬럼: 자산 분배, 보유 종목 */}
                    <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                      <AssetAllocation />
                      <HoldingsList />
                    </div>
                    {/* 오른쪽 컬럼: 빠른 실행, 관심 종목 */}
                    <div className="space-y-4 sm:space-y-6">
                      <QuickActions />
                      <StockList />
                    </div>
                  </div>
                </>
              } />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
              <Route path="/calculator" element={<CalculatorTabs />} />
              <Route path="/personality" element={<InvestmentPersonalityTest />} />
              <Route path="/portfolio" element={
                <>
                  <PortfolioSummary />
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* 왼쪽 컬럼: 자산 분배, 보유 종목 */}
                    <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                      <AssetAllocation />
                      <HoldingsList />
                    </div>
                    {/* 오른쪽 컬럼: 빠른 실행, 관심 종목 */}
                    <div className="space-y-4 sm:space-y-6">
                      <QuickActions />
                      <StockList />
                    </div>
                  </div>
                </>
              } />
            </Routes>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;