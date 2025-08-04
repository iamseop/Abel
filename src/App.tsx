import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PortfolioSummary from './components/PortfolioSummary';
import AssetAllocation from './components/AssetAllocation';
import HoldingsList from './components/HoldingsList';
import QuickActions from './components/QuickActions'; // QuickActions 임포트 유지 (다른 페이지에서 사용될 수 있으므로)
import StockList from './components/StockList'; // StockList 임포트 유지 (다른 페이지에서 사용될 수 있으므로)
import CalculatorTabs from './components/calculators/CalculatorTabs';
import InvestmentPersonalityTest from './components/personality/InvestmentPersonalityTest';
import WatchlistPage from './components/WatchlistPage';
import SimulationPage from './components/SimulationPage';
import Footer from './components/Footer';
import Login from './pages/Login';
import AccountSettings from './pages/AccountSettings';
import { useSession } from './components/SessionContextProvider';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white text-xl">
        로딩 중...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--background-start) 0%, var(--background-mid) 50%, var(--background-end) 100%)' }}>
        {session ? (
          <>
            <Header />
            <div className="flex-1 p-3 sm:p-4">
              <div className="max-w-7xl mx-auto">
                <main className="space-y-4 sm:space-y-6">
                  <Routes>
                    <Route path="/" element={
                      <>
                        <PortfolioSummary />
                        {/* 2열 그리드 레이아웃으로 변경 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          {/* 왼쪽 열: 자산 분배 */}
                          <div className="space-y-4 sm:space-y-6">
                            <AssetAllocation />
                          </div>
                          {/* 오른쪽 열: 보유 종목 */}
                          <div className="space-y-4 sm:space-y-6">
                            <HoldingsList />
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
                        {/* 2열 그리드 레이아웃으로 변경 */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                          {/* 왼쪽 열: 자산 분배 */}
                          <div className="space-y-4 sm:space-y-6">
                            <AssetAllocation />
                          </div>
                          {/* 오른쪽 열: 보유 종목 */}
                          <div className="space-y-4 sm:space-y-6">
                            <HoldingsList />
                          </div>
                        </div>
                      </>
                    } />
                    <Route path="/account-settings" element={<AccountSettings />} />
                  </Routes>
                </main>
              </div>
            </div>
            <Footer />
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Login />} />
          </Routes>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;