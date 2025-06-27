import React from 'react';
import Header from './components/Header';
import PortfolioSummary from './components/PortfolioSummary';
import AssetAllocation from './components/AssetAllocation';
import RecentTransactions from './components/RecentTransactions';
import StockList from './components/StockList';
import QuickActions from './components/QuickActions';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <div className="pt-20 p-4">
        <div className="max-w-7xl mx-auto">
          <main className="space-y-6">
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
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;