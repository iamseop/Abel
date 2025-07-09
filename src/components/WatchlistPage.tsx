import React, { useState } from 'react';
import { Bookmark, Plus, TrendingUp, TrendingDown, Search, Star, Eye } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import AddStockModal from './AddStockModal';

const WatchlistPage: React.FC = () => {
  const { stocks, watchlist, addToWatchlist, removeFromWatchlist } = usePortfolio();
  const [addStockModal, setAddStockModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');

  const watchedStocks = stocks.filter(stock => watchlist.includes(stock.symbol));
  
  const filteredStocks = watchedStocks.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.includes(searchTerm)
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.price - a.price;
      case 'change':
        return b.changePercent - a.changePercent;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleAddStock = (symbol: string, name: string) => {
    addToWatchlist(symbol, name);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">관심 종목</h1>
          </div>
          <button
            onClick={() => setAddStockModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            종목 추가
          </button>
        </div>

        {/* 검색 및 정렬 */}
        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="종목명 또는 코드 검색"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'change')}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="name">이름순</option>
              <option value="price">가격순</option>
              <option value="change">등락률순</option>
            </select>
          </div>

          {/* 통계 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm">관심 종목 수</span>
              </div>
              <p className="text-white text-xl font-bold">{watchedStocks.length}개</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm">상승 종목</span>
              </div>
              <p className="text-green-400 text-xl font-bold">
                {watchedStocks.filter(stock => stock.change > 0).length}개
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <span className="text-gray-400 text-sm">하락 종목</span>
              </div>
              <p className="text-red-400 text-xl font-bold">
                {watchedStocks.filter(stock => stock.change < 0).length}개
              </p>
            </div>
          </div>
        </div>

        {/* 종목 리스트 */}
        <div className="glass-card p-6">
          {sortedStocks.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">
                {searchTerm ? '검색 결과가 없습니다' : '관심 종목이 없습니다'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? '다른 검색어를 시도해보세요' : '관심 있는 종목을 추가해보세요'}
              </p>
              <button
                onClick={() => setAddStockModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                첫 종목 추가하기
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedStocks.map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between p-4 hover:bg-white/8 rounded-lg transition-colors border border-gray-600">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-lg">{stock.name}</h3>
                        <p className="text-gray-400">{stock.symbol}</p>
                        {stock.quantity && stock.quantity > 0 && (
                          <p className="text-blue-400 text-sm mt-1">보유: {stock.quantity}주</p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-white font-bold text-xl">₩{stock.price.toLocaleString()}</p>
                        <div className="flex items-center justify-end gap-2">
                          {stock.change > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`font-semibold ${
                            stock.change > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {stock.change > 0 ? '+' : ''}{stock.changePercent}%
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {stock.change > 0 ? '+' : ''}₩{stock.change.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                        차트 보기
                      </button>
                      <button className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                        모의투자
                      </button>
                      <button
                        onClick={() => removeFromWatchlist(stock.symbol)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddStockModal
        isOpen={addStockModal}
        onClose={() => setAddStockModal(false)}
        onAddStock={handleAddStock}
      />
    </>
  );
};

export default WatchlistPage;