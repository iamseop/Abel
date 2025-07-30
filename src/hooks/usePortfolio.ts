import { useState, useEffect } from 'react';
import { Stock, Transaction, Asset, Portfolio, UserStock, UserWatchlist } from '../types';
import { supabase } from '../integrations/supabase/client';
import { useSession } from '../components/SessionContextProvider';

// 시뮬레이션용 시장 데이터 (실제 API에서 가져올 수 있음)
const marketDataStocks: Stock[] = [
  { symbol: '005930', name: '삼성전자', price: 71000, change: 1500, changePercent: 2.16, volume: 12500000 },
  { symbol: '000660', name: 'SK하이닉스', price: 89500, change: -2100, changePercent: -2.29, volume: 8900000 },
  { symbol: '035420', name: 'NAVER', price: 185000, change: 3500, changePercent: 1.93, volume: 1200000 },
  { symbol: '035720', name: '카카오', price: 48900, change: -800, changePercent: -1.61, volume: 2800000 },
  { symbol: 'NVDA', name: '엔비디아', price: 900000, change: 15000, changePercent: 1.69, volume: 5000000 },
  { symbol: 'AAPL', name: '애플', price: 200000, change: -500, changePercent: -0.25, volume: 7000000 },
  { symbol: 'BTCUSD', name: '비트코인', price: 90000000, change: 1000000, changePercent: 1.12, volume: 100000 },
  { symbol: 'ETHUSD', name: '이더리움', price: 5000000, change: 50000, changePercent: 1.01, volume: 200000 },
];

export const usePortfolio = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [userHoldings, setUserHoldings] = useState<UserStock[]>([]);
  const [userWatchlistSymbols, setUserWatchlistSymbols] = useState<UserWatchlist[]>([]);

  // 초기 시장 데이터 설정 (더 이상 주기적으로 업데이트되지 않음)
  useEffect(() => {
    setStocks(marketDataStocks.map(s => ({ ...s, quantity: 0, averagePrice: 0 })));
  }, []);

  // 2. Supabase에서 사용자 데이터 로드
  useEffect(() => {
    if (!userId) {
      setStocks(marketDataStocks.map(s => ({ ...s, quantity: 0, averagePrice: 0 })));
      setTransactions([]);
      setWatchlist([]);
      setUserHoldings([]);
      setUserWatchlistSymbols([]);
      return;
    }

    const fetchData = async () => {
      // 보유 종목 가져오기
      const { data: holdingsData, error: holdingsError } = await supabase
        .from('user_stocks')
        .select('*')
        .eq('user_id', userId);

      if (holdingsError) {
        console.error('Error fetching user stocks:', holdingsError);
      } else {
        setUserHoldings(holdingsData || []);
      }

      // 거래 내역 가져오기
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('user_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('transaction_time', { ascending: false });

      if (transactionsError) {
        console.error('Error fetching user transactions:', transactionsError);
      } else {
        setTransactions(transactionsData.map(t => ({
          ...t,
          asset: t.asset_name, // Map asset_name back to asset for existing components
          time: new Date(t.transaction_time).toLocaleString(), // Format time for display
          date: new Date(t.transaction_time)
        })) || []);
      }

      // 관심 종목 가져오기
      const { data: watchlistsData, error: watchlistsError } = await supabase
        .from('user_watchlists')
        .select('symbol')
        .eq('user_id', userId);

      if (watchlistsError) {
        console.error('Error fetching user watchlists:', watchlistsError);
      } else {
        setUserWatchlistSymbols(watchlistsData || []);
        setWatchlist(watchlistsData.map(item => item.symbol));
      }
    };

    fetchData();

    // 실시간 변경 구독 (선택 사항, 복잡도 증가)
    // const holdingsSubscription = supabase
    //   .channel('user_stocks_changes')
    //   .on('postgres_changes', { event: '*', schema: 'public', table: 'user_stocks', filter: `user_id=eq.${userId}` }, payload => {
    //     console.log('Change received!', payload);
    //     fetchData(); // 변경 발생 시 데이터 다시 가져오기
    //   })
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(holdingsSubscription);
    // };

  }, [userId]);

  // 3. 시장 데이터와 사용자 보유 데이터를 병합하여 최종 stocks 상태 생성
  useEffect(() => {
    const combinedStocks = marketDataStocks.map(marketStock => {
      const userHolding = userHoldings.find(holding => holding.symbol === marketStock.symbol);
      return {
        ...marketStock,
        quantity: userHolding ? userHolding.quantity : 0,
        averagePrice: userHolding ? userHolding.average_price : 0
      };
    });

    // 사용자 보유 종목 중 marketDataStocks에 없는 경우 추가 (예: 직접 추가한 종목)
    userHoldings.forEach(holding => {
      if (!combinedStocks.some(s => s.symbol === holding.symbol)) {
        // 이 경우, 해당 종목의 실시간 시장 데이터는 없으므로, 보유 정보만 표시
        combinedStocks.push({
          symbol: holding.symbol,
          name: holding.symbol, // 이름 정보가 없으므로 심볼로 대체
          price: holding.average_price, // 임시로 평단가를 현재가로 설정
          change: 0,
          changePercent: 0,
          volume: 0,
          quantity: holding.quantity,
          averagePrice: holding.average_price
        });
      }
    });

    setStocks(combinedStocks);
  }, [userHoldings, userWatchlistSymbols]); // userHoldings나 userWatchlistSymbols가 변경될 때마다 stocks 업데이트

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'time' | 'date'> & { symbol: string; name: string }) => {
    if (!userId) return;

    const { error } = await supabase.from('user_transactions').insert({
      user_id: userId,
      type: transaction.type,
      asset_name: transaction.name, // Use name for asset_name
      symbol: transaction.symbol,
      amount: transaction.amount,
      price: transaction.price,
    });

    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }

    // 트랜잭션 추가 후 보유 종목 업데이트 로직
    const existingHolding = userHoldings.find(h => h.symbol === transaction.symbol);
    let newQuantity = 0;
    let newAveragePrice = 0;

    if (transaction.type === 'buy') {
      const currentQuantity = existingHolding ? existingHolding.quantity : 0;
      const currentTotalCost = existingHolding ? currentQuantity * existingHolding.average_price : 0;
      
      newQuantity = currentQuantity + transaction.amount;
      const newTotalCost = currentTotalCost + (transaction.amount * transaction.price);
      newAveragePrice = newQuantity > 0 ? newTotalCost / newQuantity : 0;

    } else { // sell
      newQuantity = existingHolding ? Math.max(0, existingHolding.quantity - transaction.amount) : 0;
      newAveragePrice = existingHolding ? existingHolding.average_price : 0; // 매도 시 평단가는 변하지 않음
    }

    if (existingHolding) {
      if (newQuantity === 0) {
        // 수량이 0이 되면 보유 종목에서 삭제
        const { error: deleteError } = await supabase.from('user_stocks').delete().eq('id', existingHolding.id);
        if (deleteError) console.error('Error deleting user stock:', deleteError);
      } else {
        // 기존 보유 종목 업데이트
        const { error: updateError } = await supabase.from('user_stocks').update({
          quantity: newQuantity,
          average_price: newAveragePrice
        }).eq('id', existingHolding.id);
        if (updateError) console.error('Error updating user stock:', updateError);
      }
    } else if (transaction.type === 'buy' && newQuantity > 0) {
      // 새로운 보유 종목 추가
      const { error: insertError } = await supabase.from('user_stocks').insert({
        user_id: userId,
        symbol: transaction.symbol,
        quantity: newQuantity,
        average_price: newAveragePrice
      });
      if (insertError) console.error('Error inserting new user stock:', insertError);
    }
    
    // 데이터 다시 불러오기 (UI 업데이트)
    const { data: updatedHoldings, error: fetchHoldingsError } = await supabase
      .from('user_stocks')
      .select('*')
      .eq('user_id', userId);
    if (fetchHoldingsError) console.error('Error refetching holdings:', fetchHoldingsError);
    else setUserHoldings(updatedHoldings || []);

    const { data: updatedTransactions, error: fetchTransactionsError } = await supabase
      .from('user_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_time', { ascending: false });
    if (fetchTransactionsError) console.error('Error refetching transactions:', fetchTransactionsError);
    else setTransactions(updatedTransactions.map(t => ({
      ...t,
      asset: t.asset_name,
      time: new Date(t.transaction_time).toLocaleString(),
      date: new Date(t.transaction_time)
    })) || []);
  };

  const addHolding = async (symbol: string, name: string, quantity: number, averagePrice: number) => {
    if (!userId) return;

    const existingHolding = userHoldings.find(h => h.symbol === symbol);

    if (existingHolding) {
      const currentQuantity = existingHolding.quantity;
      const currentTotalCost = currentQuantity * existingHolding.average_price;
      const newQuantity = currentQuantity + quantity;
      const newTotalCost = currentTotalCost + (quantity * averagePrice);
      const recalculatedAveragePrice = newQuantity > 0 ? newTotalCost / newQuantity : 0;

      const { error } = await supabase.from('user_stocks').update({
        quantity: newQuantity,
        average_price: recalculatedAveragePrice
      }).eq('id', existingHolding.id);

      if (error) {
        console.error('Error updating holding:', error);
        return;
      }
    } else {
      const { error } = await supabase.from('user_stocks').insert({
        user_id: userId,
        symbol,
        quantity,
        average_price: averagePrice
      });

      if (error) {
        console.error('Error adding new holding:', error);
        return;
      }
    }

    // 트랜잭션 기록
    await addTransaction({ type: 'buy', symbol, name, amount: quantity, price: averagePrice });

    // 데이터 다시 불러오기 (UI 업데이트)
    const { data: updatedHoldings, error: fetchHoldingsError } = await supabase
      .from('user_stocks')
      .select('*')
      .eq('user_id', userId);
    if (fetchHoldingsError) console.error('Error refetching holdings:', fetchHoldingsError);
    else setUserHoldings(updatedHoldings || []);
  };

  const addToWatchlist = async (symbol: string, name?: string) => {
    if (!userId) return;

    const existingWatchlistItem = userWatchlistSymbols.find(item => item.symbol === symbol);
    if (existingWatchlistItem) {
      console.log('Already in watchlist');
      return;
    }

    const { error } = await supabase.from('user_watchlists').insert({
      user_id: userId,
      symbol
    });

    if (error) {
      console.error('Error adding to watchlist:', error);
      return;
    }

    // UI 업데이트를 위해 로컬 상태 업데이트
    setWatchlist(prev => [...prev, symbol]);

    // marketDataStocks에 없는 새로운 종목이라면 추가 (시뮬레이션용)
    if (!marketDataStocks.some(s => s.symbol === symbol) && name) {
      const newStock: Stock = {
        symbol,
        name,
        price: Math.floor(Math.random() * 100000) + 10000,
        change: 0, // 초기 변경값 0
        changePercent: 0, // 초기 변경률 0
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        quantity: 0 // 초기 수량은 0
      };
      marketDataStocks.push(newStock); // marketDataStocks에 추가하여 이후 병합 시 포함되도록
      setStocks(prev => [...prev, newStock]); // 즉시 UI에 반영
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    if (!userId) return;

    const { error } = await supabase.from('user_watchlists').delete()
      .eq('user_id', userId)
      .eq('symbol', symbol);

    if (error) {
      console.error('Error removing from watchlist:', error);
      return;
    }

    setWatchlist(prev => prev.filter(s => s !== symbol));
  };

  const updateHolding = async (symbol: string, quantity: number, averagePrice: number) => {
    if (!userId) return;

    const existingHolding = userHoldings.find(h => h.symbol === symbol);

    if (existingHolding) {
      if (quantity === 0) {
        // 수량이 0이 되면 보유 종목에서 삭제
        const { error } = await supabase.from('user_stocks').delete().eq('id', existingHolding.id);
        if (error) console.error('Error deleting user stock:', error);
      } else {
        // 기존 보유 종목 업데이트
        const { error } = await supabase.from('user_stocks').update({
          quantity,
          average_price: averagePrice
        }).eq('id', existingHolding.id);
        if (error) console.error('Error updating user stock:', error);
      }
    } else if (quantity > 0) {
      // 새로운 보유 종목 추가 (수량이 0이 아니면)
      const { error } = await supabase.from('user_stocks').insert({
        user_id: userId,
        symbol,
        quantity,
        average_price: averagePrice
      });
      if (error) console.error('Error inserting new user stock:', error);
    }

    // 데이터 다시 불러오기 (UI 업데이트)
    const { data: updatedHoldings, error: fetchHoldingsError } = await supabase
      .from('user_stocks')
      .select('*')
      .eq('user_id', userId);
    if (fetchHoldingsError) console.error('Error refetching holdings:', fetchHoldingsError);
    else setUserHoldings(updatedHoldings || []);
  };

  const getAssets = (): Asset[] => {
    const assets: Asset[] = [];
    let totalValue = 0;

    stocks.forEach(stock => {
      if (stock.quantity && stock.quantity > 0) {
        const value = stock.price * stock.quantity;
        totalValue += value;
        assets.push({
          name: stock.name,
          value,
          percentage: 0,
          color: getColorForStock(stock.symbol),
          quantity: stock.quantity
        });
      }
    });

    return assets.map(asset => ({
      ...asset,
      percentage: (asset.value / totalValue) * 100
    }));
  };

  const getPortfolioSummary = (): Portfolio => {
    const assets = getAssets();
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    const todayChange = stocks.reduce((sum, stock) => {
      if (stock.quantity && stock.quantity > 0) {
        return sum + (stock.change * stock.quantity);
      }
      return sum;
    }, 0);

    const todayChangePercent = totalValue > 0 ? (todayChange / (totalValue - todayChange)) * 100 : 0;
    
    return {
      totalValue,
      todayChange,
      todayChangePercent: Number(todayChangePercent.toFixed(2)),
      monthlyChange: 0, // 임시 값 제거
      monthlyChangePercent: 0 // 임시 값 제거
    };
  };

  return {
    stocks,
    transactions,
    watchlist,
    addTransaction,
    addToWatchlist,
    removeFromWatchlist,
    updateHolding,
    addHolding,
    getAssets,
    getPortfolioSummary
  };
};

const getColorForStock = (symbol: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-cyan-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-lime-500'
  ];
  
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};