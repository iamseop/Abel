import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, Filter } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import Modal from './Modal';

const RecentTransactions: React.FC = () => {
  const { transactions } = usePortfolio();
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const displayTransactions = showAllTransactions ? filteredTransactions : filteredTransactions.slice(0, 4);

  return (
    <>
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">최근 거래</h2>
          </div>
          <button
            onClick={() => setShowAllTransactions(true)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1"
          >
            <Filter className="w-4 h-4" />
            전체보기
          </button>
        </div>

        <div className="space-y-4">
          {displayTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'buy' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {transaction.type === 'buy' ? (
                    <ArrowDownRight className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold">{transaction.asset}</p>
                  <p className="text-gray-400 text-sm">
                    {transaction.type === 'buy' ? '매수' : '매도'} {transaction.amount}주
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'buy' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {transaction.type === 'buy' ? '-' : '+'}₩{(transaction.amount * transaction.price).toLocaleString()}
                </p>
                <p className="text-gray-400 text-sm">{transaction.time}</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setShowAllTransactions(true)}
          className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          모든 거래 내역 보기
        </button>
      </div>

      <Modal
        isOpen={showAllTransactions}
        onClose={() => setShowAllTransactions(false)}
        title="전체 거래 내역"
      >
        <div className="mb-4">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter('buy')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                filter === 'buy'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              매수
            </button>
            <button
              onClick={() => setFilter('sell')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                filter === 'sell'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              매도
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'buy' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {transaction.type === 'buy' ? (
                    <ArrowDownRight className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{transaction.asset}</p>
                  <p className="text-gray-400 text-xs">
                    {transaction.type === 'buy' ? '매수' : '매도'} {transaction.amount}주
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold text-sm ${
                  transaction.type === 'buy' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {transaction.type === 'buy' ? '-' : '+'}₩{(transaction.amount * transaction.price).toLocaleString()}
                </p>
                <p className="text-gray-400 text-xs">{transaction.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default RecentTransactions;