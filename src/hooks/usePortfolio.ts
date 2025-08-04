import { useState, useEffect, useMemo, useCallback } from 'react';
import { Stock, Transaction, Asset, Portfolio, UserStock, UserWatchlist, FuturesPosition, FuturesTransaction } from '../types';
import { supabase } from '../integrations/supabase/client';
import { showSuccess, showError } from '../utils/toast';
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
  { symbol: 'TRXUSD', name: '트론', price: 100, change: 5, changePercent: 5.26, volume: 5000000 }, // TRX 더미 데이터
  { symbol: 'ETCUSD', name: '이더리움클래식', price: 30000, change: -1000, changePercent: -3.23, volume: 150000 }, // ETC 더미 데이터
];

export const usePortfolio = () => {
  const { session } = useSession();
  const userId = session?.user?.id;

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [userHoldings, setUserHoldings] = useState<UserStock[]>([]);
  const [userWatchlistSymbols, setUserWatchlistSymbols] = useState<UserWatchlist[]>([]);
  const [userFuturesPositions, setUserFuturesPositions] = useState<FuturesPosition[]>([]); // 선물 포지션 상태
  const [userFuturesTransactions, setUserFuturesTransactions] = useState<FuturesTransaction[]>([]); // 선물 거래 내역 상태
  const [userBalance, setUserBalance] = useState<number>(0); // 사용자 잔고 상태

  // 초기 시장 데이터 설정
  useEffect(() => {
    setStocks(marketDataStocks.map(s => ({ ...s, quantity: 0, averagePrice: 0 })));
  }, []);

  // 모든 사용자 관련 데이터를 Supabase에서 불러오는 함수
  const fetchAllUserData = useCallback(async () => {
    if (!userId) {
      setStocks(marketDataStocks.map(s => ({ ...s, quantity: 0, averagePrice: 0 })));
      setTransactions([]);
      setWatchlist([]);
      setUserHoldings([]);
      setUserWatchlistSymbols([]);
      setUserFuturesPositions([]);
      setUserFuturesTransactions([]);
      setUserBalance(0);
      return;
    }

    // 사용자 잔고 가져오기
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    if (profileError && profileError.code === 'PGRST116') { // PGRST116은 .single() 쿼리에서 결과가 없을 때 발생
        // 프로필이 없는 경우, 새로 생성
        console.warn('User profile not found, creating a new one.');
        const { data: newProfileData, error: insertError } = await supabase
            .from('profiles')
            .insert({ id: userId, balance: 100000 }) // 기본 잔고 100,000으로 설정
            .select('balance')
            .single();

        if (insertError) {
            console.error('Error creating new user profile:', insertError);
            showError('사용자 잔고를 초기화하는 데 실패했습니다.');
        } else {
            setUserBalance(newProfileData?.balance || 0);
            showSuccess('새로운 사용자 프로필이 생성되었습니다.');
        }
    } else if (profileError) {
      console.error('Error fetching user profile:', profileError);
      showError('사용자 잔고를 불러오는 데 실패했습니다.');
    } else {
      setUserBalance(profileData?.balance || 0);
    }

    // 보유 종목 가져오기
    const { data: holdingsData, error: holdingsError } = await supabase
      .from('user_stocks')
      .select('*, name')
      .eq('user_id', userId);

    if (holdingsError) {
      console.error('Error fetching user stocks:', holdingsError);
      showError('보유 종목을 불러오는 데 실패했습니다.');
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
      showError('거래 내역을 불러오는 데 실패했습니다.');
    } else {
      setTransactions(transactionsData.map(t => ({
        ...t,
        asset: t.asset_name,
        time: new Date(t.transaction_time).toLocaleString(),
        date: new Date(t.transaction_time)
      })) || []);
    }

    // 관심 종목 가져오기
    const { data: watchlistsData, error: watchlistsError } = await supabase
      .from('user_watchlists')
      .select('symbol, coingecko_id') // coingecko_id 필드 추가
      .eq('user_id', userId);

    if (watchlistsError) {
      console.error('Error fetching user watchlists:', watchlistsError);
      showError('관심 종목을 불러오는 데 실패했습니다.');
    } else {
      setUserWatchlistSymbols(watchlistsData || []);
      setWatchlist(watchlistsData.map(item => item.symbol));
    }

    // 선물 포지션 가져오기
    const { data: futuresPositionsData, error: futuresPositionsError } = await supabase
      .from('user_futures_positions')
      .select('*')
      .eq('user_id', userId);

    if (futuresPositionsError) {
      console.error('Error fetching user futures positions:', futuresPositionsError);
      showError('선물 포지션을 불러오는 데 실패했습니다.');
    } else {
      setUserFuturesPositions(futuresPositionsData || []);
    }

    // 선물 거래 내역 가져오기
    const { data: futuresTransactionsData, error: futuresTransactionsError } = await supabase
      .from('user_futures_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('transaction_time', { ascending: false });

    if (futuresTransactionsError) {
      console.error('Error fetching user futures transactions:', futuresTransactionsError);
      showError('선물 거래 내역을 불러오는 데 실패했습니다.');
    } else {
      setUserFuturesTransactions(futuresTransactionsData || []);
    }

  }, [userId]);

  // CoinGecko 실시간 시세를 가져오는 함수 (Supabase Edge Function 호출)
  const fetchCryptoPrices = useCallback(async () => {
    try {
      // CoinGecko에서 사용할 ID 목록을 동적으로 생성
      // 기본 코인 + 사용자가 추가한 관심 종목 중 coingecko_id가 있는 코인
      const defaultCryptoIds = ['bitcoin', 'ethereum', 'tron', 'ethereum-classic'];
      const watchlistCryptoIds = userWatchlistSymbols
        .filter(item => item.coingecko_id)
        .map(item => item.coingecko_id as string);
      
      const uniqueCryptoIds = Array.from(new Set([...defaultCryptoIds, ...watchlistCryptoIds]));

      const vsCurrencies = ['krw']; // 원화 기준

      const { data, error } = await supabase.functions.invoke('get-coingecko-prices', {
        body: { ids: uniqueCryptoIds, vs_currencies: vsCurrencies },
      });

      if (error) {
        throw error;
      }

      const cryptoPrices = data as Stock[]; // Stock[] 타입으로 가정

      setStocks(prevStocks => {
        const updatedStocks = prevStocks.map(stock => {
          const cryptoData = cryptoPrices.find(cp => {
            // CoinGecko ID와 앱의 심볼 매핑
            // CoinGecko API 응답의 symbol은 대문자, id는 소문자
            const coingeckoIdFromWatchlist = userWatchlistSymbols.find(w => w.symbol === stock.symbol)?.coingecko_id;

            if (coingeckoIdFromWatchlist) {
              return cp.symbol.toLowerCase() === coingeckoIdFromWatchlist.toLowerCase() || cp.id.toLowerCase() === coingeckoIdFromWatchlist.toLowerCase();
            }
            
            // 기존 하드코딩된 매핑
            if (stock.symbol === 'BTCUSD' && (cp.symbol === 'BITCOIN' || cp.id === 'bitcoin')) return true;
            if (stock.symbol === 'ETHUSD' && (cp.symbol === 'ETHEREUM' || cp.id === 'ethereum')) return true;
            if (stock.symbol === 'TRXUSD' && (cp.symbol === 'TRON' || cp.id === 'tron')) return true;
            if (stock.symbol === 'ETCUSD' && (cp.symbol === 'ETHEREUM-CLASSIC' || cp.id === 'ethereum-classic')) return true;
            
            return false;
          });

          if (cryptoData) {
            const oldPrice = stock.price;
            const newPrice = cryptoData.price;
            const change = newPrice - oldPrice;
            const changePercent = oldPrice !== 0 ? (change / oldPrice) * 100 : 0;

            return {
              ...stock,
              price: newPrice,
              change: parseFloat(change.toFixed(2)),
              changePercent: parseFloat(changePercent.toFixed(2)),
              name: cryptoData.name, // CoinGecko에서 가져온 이름으로 업데이트
            };
          }
          return stock;
        });

        // CoinGecko에서 가져온 암호화폐 중 기존 stocks에 없는 경우 추가
        cryptoPrices.forEach(crypto => {
          // CoinGecko ID를 기반으로 앱의 심볼 형식 결정 (예: bitcoin -> BTCUSD)
          let appSymbol = crypto.symbol; // 기본적으로 CoinGecko symbol 사용
          if (crypto.id === 'bitcoin') appSymbol = 'BTCUSD';
          else if (crypto.id === 'ethereum') appSymbol = 'ETHUSD';
          else if (crypto.id === 'tron') appSymbol = 'TRXUSD';
          else if (crypto.id === 'ethereum-classic') appSymbol = 'ETCUSD';
          // 그 외의 코인은 CoinGecko symbol을 그대로 사용 (예: XRP, DOGE)

          if (!updatedStocks.some(s => s.symbol === appSymbol)) {
            updatedStocks.push({
              symbol: appSymbol,
              name: crypto.name,
              price: crypto.price,
              change: crypto.change,
              changePercent: crypto.changePercent,
              volume: crypto.volume,
              quantity: 0,
              averagePrice: 0,
            });
          }
        });

        return updatedStocks;
      });
    } catch (error) {
      console.error('Error fetching crypto prices from Edge Function:', error);
      // showError('실시간 암호화폐 시세를 불러오는 데 실패했습니다.'); // 너무 잦은 알림 방지
    }
  }, [userWatchlistSymbols]); // userWatchlistSymbols가 변경될 때마다 cryptoIds 목록이 재구성되도록 의존성 추가

  // 초기 데이터 로드 및 userId 변경 시 데이터 다시 불러오기
  useEffect(() => {
    fetchAllUserData();
  }, [userId, fetchAllUserData]);

  // Supabase Realtime 구독 설정
  useEffect(() => {
    if (!userId) return;

    // profiles 구독 (잔고 업데이트)
    const profilesChannel = supabase
      .channel('profiles_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setUserBalance((payload.new as { balance: number }).balance);
          }
        }
      )
      .subscribe();

    // user_stocks 구독
    const stocksChannel = supabase
      .channel('user_stocks_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_stocks', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUserHoldings(prev => [...prev, payload.new as UserStock]);
          } else if (payload.eventType === 'UPDATE') {
            setUserHoldings(prev => prev.map(h => h.id === payload.old.id ? payload.new as UserStock : h));
          } else if (payload.eventType === 'DELETE') {
            setUserHoldings(prev => prev.filter(h => h.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // user_transactions 구독
    const transactionsChannel = supabase
      .channel('user_transactions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_transactions', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTransactions(prev => [{
              ...payload.new as Transaction,
              asset: (payload.new as Transaction).asset_name,
              time: new Date((payload.new as Transaction).transaction_time).toLocaleString(),
              date: new Date((payload.new as Transaction).transaction_time)
            }, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTransactions(prev => prev.map(t => t.id === payload.old.id ? {
              ...payload.new as Transaction,
              asset: (payload.new as Transaction).asset_name,
              time: new Date((payload.new as Transaction).transaction_time).toLocaleString(),
              date: new Date((payload.new as Transaction).transaction_time)
            } : t));
          } else if (payload.eventType === 'DELETE') {
            setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // user_watchlists 구독
    const watchlistsChannel = supabase
      .channel('user_watchlists_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_watchlists', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUserWatchlistSymbols(prev => [...prev, payload.new as UserWatchlist]);
            setWatchlist(prev => [...prev, (payload.new as UserWatchlist).symbol]);
          } else if (payload.eventType === 'DELETE') {
            setUserWatchlistSymbols(prev => prev.filter(w => w.id !== payload.old.id));
            setWatchlist(prev => prev.filter(s => s !== (payload.old as UserWatchlist).symbol));
          }
        }
      )
      .subscribe();

    // user_futures_positions 구독
    const futuresPositionsChannel = supabase
      .channel('user_futures_positions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_futures_positions', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUserFuturesPositions(prev => [...prev, payload.new as FuturesPosition]);
          } else if (payload.eventType === 'UPDATE') {
            setUserFuturesPositions(prev => prev.map(p => p.id === payload.old.id ? payload.new as FuturesPosition : p));
          } else if (payload.eventType === 'DELETE') {
            setUserFuturesPositions(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // user_futures_transactions 구독
    const futuresTransactionsChannel = supabase
      .channel('user_futures_transactions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_futures_transactions', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setUserFuturesTransactions(prev => [...prev, payload.new as FuturesTransaction]);
          } else if (payload.eventType === 'UPDATE') {
            setUserFuturesTransactions(prev => prev.map(t => t.id === payload.old.id ? payload.new as FuturesTransaction : t));
          } else if (payload.eventType === 'DELETE') {
            setUserFuturesTransactions(prev => prev.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(stocksChannel);
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(watchlistsChannel);
      supabase.removeChannel(futuresPositionsChannel);
      supabase.removeChannel(futuresTransactionsChannel);
    };
  }, [userId]);

  // 시장 데이터와 사용자 보유 데이터를 병합하여 최종 stocks 상태 생성
  useEffect(() => {
    const combinedStocks = marketDataStocks.map(marketStock => {
      const userHolding = userHoldings.find(holding => holding.symbol === marketStock.symbol);
      return {
        ...marketStock,
        quantity: userHolding ? userHolding.quantity : 0,
        averagePrice: userHolding ? userHolding.average_price : 0,
        name: userHolding?.name || marketStock.name // userHolding의 name을 우선 사용
      };
    });

    // 사용자 보유 종목 중 marketDataStocks에 없는 경우 추가 (예: 직접 추가한 종목)
    userHoldings.forEach(holding => {
      if (!combinedStocks.some(s => s.symbol === holding.symbol)) {
        combinedStocks.push({
          symbol: holding.symbol,
          name: holding.name || holding.symbol, // holding.name이 없으면 symbol로 대체
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

  // 10초마다 CoinGecko 시세 업데이트
  useEffect(() => {
    fetchCryptoPrices(); // 컴포넌트 마운트 시 즉시 호출
    const intervalId = setInterval(fetchCryptoPrices, 10000); // 10초마다 업데이트
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, [fetchCryptoPrices]);

  // 선물 포지션에 실시간 가격 및 미실현 손익 업데이트
  const futuresPositionsWithPnl = useMemo(() => {
    return userFuturesPositions.map(position => {
      const currentPrice = stocks.find(s => s.symbol === position.symbol)?.price || 0;
      let unrealizedPnl = 0;
      let unrealizedPnlPercent = 0;

      if (currentPrice > 0) {
        if (position.position_side === 'LONG') {
          unrealizedPnl = (currentPrice - position.entry_price) * position.quantity * position.leverage;
        } else { // SHORT
          unrealizedPnl = (position.entry_price - currentPrice) * position.quantity * position.leverage;
        }
        unrealizedPnlPercent = (unrealizedPnl / (position.entry_price * position.quantity * position.leverage)) * 100;
      }

      return {
        ...position,
        current_price: currentPrice,
        unrealized_pnl: unrealizedPnl,
        unrealized_pnl_percent: unrealizedPnlPercent,
      };
    });
  }, [userFuturesPositions, stocks]);

  // 사용자 잔고 업데이트 함수
  const updateUserBalance = useCallback(async (amount: number, type: 'deposit' | 'withdraw' | 'realized_pnl') => {
    if (!userId) {
      showError('로그인이 필요합니다.');
      return;
    }

    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code === 'PGRST116') {
        // 프로필이 없는 경우, 새로 생성
        console.warn('User profile not found during balance update, creating a new one.');
        const { data: newProfileData, error: insertError } = await supabase
            .from('profiles')
            .insert({ id: userId, balance: 100000 }) // 기본 잔고 100,000으로 설정
            .select('balance')
            .single();

        if (insertError) {
            console.error('Error creating new user profile for balance update:', insertError);
            showError('잔고 업데이트를 위한 프로필 초기화에 실패했습니다.');
            return;
        }
        // 새로 생성된 프로필의 잔고로 시작
        profile.balance = newProfileData?.balance || 0;
    } else if (fetchError) {
      console.error('Error fetching profile for balance update:', fetchError);
      showError('잔고 정보를 불러오는 데 실패했습니다.');
      return;
    }

    let newBalance = profile.balance;
    if (type === 'deposit' || type === 'realized_pnl') {
      newBalance += amount;
    } else if (type === 'withdraw') {
      newBalance -= amount;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating balance:', updateError);
      showError('잔고 업데이트에 실패했습니다.');
    } else {
      showSuccess('잔고가 업데이트되었습니다.');
    }
  }, [userId]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id' | 'time' | 'date' | 'user_id'> & { symbol: string; name: string }) => {
    if (!userId) {
      showError('로그인이 필요합니다.');
      return;
    }

    const { error: transactionError } = await supabase.from('user_transactions').insert({
      user_id: userId,
      type: transaction.type,
      asset_name: transaction.name,
      symbol: transaction.symbol,
      amount: transaction.amount,
      price: transaction.price,
    });

    if (transactionError) {
      console.error('Error adding transaction:', transactionError);
      showError('거래 내역 추가에 실패했습니다.');
      return;
    }
    showSuccess('거래 내역이 추가되었습니다.');
  }, [userId]);

  const addHolding = useCallback(async (symbol: string, name: string, quantity: number, averagePrice: number) => {
    if (!userId) {
      showError('로그인이 필요합니다.');
      return;
    }

    const existingHolding = userHoldings.find(h => h.symbol === symbol);
    let error;

    if (existingHolding) {
      const currentQuantity = existingHolding.quantity;
      const currentTotalCost = currentQuantity * existingHolding.average_price;
      const newQuantity = currentQuantity + quantity;
      const newTotalCost = currentTotalCost + (quantity * averagePrice);
      const recalculatedAveragePrice = newQuantity > 0 ? newTotalCost / newQuantity : 0;

      ({ error } = await supabase.from('user_stocks').update({
        quantity: newQuantity,
        average_price: recalculatedAveragePrice,
        name: name // name 필드 업데이트 추가
      }).eq('id', existingHolding.id));

      if (error) {
        console.error('Error updating holding:', error);
        showError('보유 종목 업데이트에 실패했습니다.');
        return;
      }
      showSuccess('보유 종목이 업데이트되었습니다.');
    } else {
      ({ error } = await supabase.from('user_stocks').insert({
        user_id: userId,
        symbol,
        quantity,
        average_price: averagePrice,
        name: name // name 필드 추가
      }));

      if (error) {
        console.error('Error adding new holding:', error);
        showError('새 보유 종목 추가에 실패했습니다.');
        return;
      }
      showSuccess('새 보유 종목이 추가되었습니다.');
    }

    // 트랜잭션 기록 (addTransaction 내부에서 토스트 알림 처리)
    await addTransaction({ type: 'buy', symbol, name, amount: quantity, price: averagePrice });
  }, [userId, userHoldings, addTransaction]);

  const addToWatchlist = useCallback(async (symbol: string, name?: string, coingeckoId?: string) => {
    if (!userId) {
      showError('로그인이 필요합니다.');
      return;
    }

    const existingWatchlistItem = userWatchlistSymbols.find(item => item.symbol === symbol);
    if (existingWatchlistItem) {
      showError('이미 관심 종목에 추가되어 있습니다.');
      return;
    }

    const { error } = await supabase.from('user_watchlists').insert({
      user_id: userId,
      symbol,
      coingecko_id: coingeckoId || null // coingeckoId 저장
    });

    if (error) {
      console.error('Error adding to watchlist:', error);
      showError('관심 종목 추가에 실패했습니다.');
      return;
    }

    showSuccess('관심 종목에 추가되었습니다.');

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
      // marketDataStocks.push(newStock); // marketDataStocks에 직접 추가하는 대신 setStocks로 상태 업데이트
      setStocks(prev => [...prev, newStock]); // 즉시 UI에 반영
    }
  }, [userId, userWatchlistSymbols]);

  const removeFromWatchlist = useCallback(async (symbol: string) => {
    if (!userId) {
      showError('로그인이 필요합니다.');
      return;
    }

    const { error } = await supabase.from('user_watchlists').delete()
      .eq('user_id', userId)
      .eq('symbol', symbol);

    if (error) {
      console.error('Error removing from watchlist:', error);
      showError('관심 종목 삭제에 실패했습니다.');
      return;
    }

    showSuccess('관심 종목에서 삭제되었습니다.');
  }, [userId]);

  const updateHolding = useCallback(async (symbol: string, quantity: number, averagePrice: number, name: string) => { // name 파라미터 추가
    if (!userId) {
      showError('로그인이 필요합니다.');
      return;
    }

    const existingHolding = userHoldings.find(h => h.symbol === symbol);
    let error;

    if (existingHolding) {
      if (quantity === 0) {
        // 수량이 0이 되면 보유 종목에서 삭제
        ({ error } = await supabase.from('user_stocks').delete().eq('id', existingHolding.id));
        if (error) {
          console.error('Error deleting user stock:', error);
          showError('보유 종목 삭제에 실패했습니다.');
          return;
        }
        showSuccess('보유 종목이 삭제되었습니다.');
      } else {
        // 기존 보유 종목 업데이트
        ({ error } = await supabase.from('user_stocks').update({
          quantity: quantity,
          average_price: averagePrice,
          name: name // name 필드 업데이트 추가
        }).eq('id', existingHolding.id));
        if (error) {
          console.error('Error updating user stock:', error);
          showError('보유 종목 업데이트에 실패했습니다.');
          return;
        }
        showSuccess('보유 종목이 업데이트되었습니다.');
      }
    } else if (quantity > 0) {
      // 새로운 보유 종목 추가 (수량이 0이 아니면)
      ({ error } = await supabase.from('user_stocks').insert({
        user_id: userId,
        symbol,
        quantity,
        average_price: averagePrice,
        name: name // name 필드 추가
      }));

      if (error) {
        console.error('Error inserting new user stock:', error);
        showError('새 보유 종목 추가에 실패했습니다.');
        return;
      }
      showSuccess('새 보유 종목이 추가되었습니다.');
    }
  }, [userId, userHoldings]);

  const deleteHolding = useCallback(async (symbol: string) => {
    if (!userId) {
      showError('로그인이 필요합니다.');
      return;
    }

    const holdingToDelete = userHoldings.find(h => h.symbol === symbol);

    if (!holdingToDelete) {
      showError('삭제할 보유 종목을 찾을 수 없습니다.');
      return;
    }

    const { error } = await supabase.from('user_stocks').delete().eq('id', holdingToDelete.id);

    if (error) {
      console.error('Error deleting holding:', error);
      showError('보유 종목 삭제에 실패했습니다.');
    } else {
      showSuccess('보유 종목이 삭제되었습니다.');
    }
  }, [userId, userHoldings]);

  // 선물 포지션 개설
  const openFuturesPosition = useCallback(async (
    symbol: string,
    position_side: 'LONG' | 'SHORT',
    quantity: number,
    entry_price: number,
    leverage: number
  ) => {
    if (!userId) {
      showError('로그인이 필요합니다.');
      return;
    }

    const initialMargin = (quantity * entry_price) / leverage;
    if (userBalance < initialMargin) {
      showError('잔고가 부족합니다.');
      return;
    }

    const { data, error } = await supabase.from('user_futures_positions').insert({
      user_id: userId,
      symbol,
      position_side,
      quantity,
      entry_price,
      liquidation_price: null, // 초기에는 청산 가격을 계산하지 않음
      leverage,
    }).select().single();

    if (error) {
      console.error('Error opening futures position:', error);
      showError('선물 포지션 개설에 실패했습니다.');
      return;
    }
    showSuccess('선물 포지션이 개설되었습니다.');

    // 잔고에서 증거금 차감
    await updateUserBalance(-initialMargin, 'withdraw');

    // 선물 거래 내역 기록
    await addFuturesTransaction({
      symbol,
      type: `OPEN_${position_side}`,
      quantity,
      price: entry_price,
      leverage,
      fee: 0, // 수수료는 나중에 계산
    });
  }, [userId, userBalance, updateUserBalance]);

  // 선물 포지션 청산
  const closeFuturesPosition = useCallback(async (
    positionId: string,
    symbol: string,
    position_side: 'LONG' | 'SHORT',
    quantity: number,
    entry_price: number,
    leverage: number,
    close_price: number
  ) => {
    if (!userId) {
      showError('로그인이 필요합니다.');
      return;
    }

    const { error: deleteError } = await supabase.from('user_futures_positions').delete().eq('id', positionId);

    if (deleteError) {
      console.error('Error closing futures position:', deleteError);
      showError('선물 포지션 청산에 실패했습니다.');
      return;
    }
    showSuccess('선물 포지션이 청산되었습니다.');

    // 실현 손익 계산
    let realizedPnl = 0;
    if (position_side === 'LONG') {
      realizedPnl = (close_price - entry_price) * quantity * leverage;
    } else { // SHORT
      realizedPnl = (entry_price - close_price) * quantity * leverage;
    }

    // 잔고에 실현 손익 추가 (음수일 경우 차감)
    await updateUserBalance(realizedPnl, 'realized_pnl');

    // 선물 거래 내역 기록
    await addFuturesTransaction({
      symbol,
      type: `CLOSE_${position_side}`,
      quantity,
      price: close_price,
      leverage,
      fee: 0, // 수수료는 나중에 계산
    });
  }, [userId, updateUserBalance]);

  // 선물 거래 내역 추가
  const addFuturesTransaction = useCallback(async (transaction: Omit<FuturesTransaction, 'id' | 'user_id' | 'transaction_time'>) => {
    if (!userId) {
      showError('로그인이 필요합니다.');
      return;
    }

    const { error } = await supabase.from('user_futures_transactions').insert({
      user_id: userId,
      symbol: transaction.symbol,
      type: transaction.type,
      quantity: transaction.quantity,
      price: transaction.price,
      leverage: transaction.leverage,
      fee: transaction.fee,
    });

    if (error) {
      console.error('Error adding futures transaction:', error);
      showError('선물 거래 내역 추가에 실패했습니다.');
    }
  }, [userId]);

  const assets = useMemo(() => {
    const calculatedAssets: Asset[] = [];
    let totalValue = 0;

    stocks.forEach(stock => {
      if (stock.quantity && stock.quantity > 0) {
        const value = stock.price * stock.quantity;
        totalValue += value;
        calculatedAssets.push({
          name: stock.name,
          value,
          percentage: 0,
          color: getColorForStock(stock.symbol),
          quantity: stock.quantity
        });
      }
    });

    const sortedAssets = calculatedAssets.sort((a, b) => b.value - a.value);

    return sortedAssets.map(asset => ({
      ...asset,
      percentage: (asset.value / totalValue) * 100
    }));
  }, [stocks]);

  const portfolioSummary = useMemo(() => {
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    const todayChange = stocks.reduce((sum, stock) => {
      if (stock.quantity && stock.quantity > 0) {
        const previousPrice = stock.price / (1 + stock.changePercent / 100);
        const changeAmount = stock.price - previousPrice;
        return sum + (changeAmount * stock.quantity);
      }
      return sum;
    }, 0);

    const todayChangePercent = totalValue > 0 ? (todayChange / (totalValue - todayChange)) * 100 : 0;
    
    return {
      totalValue,
      todayChange,
      todayChangePercent: Number(todayChangePercent.toFixed(2)),
      monthlyChange: 0, // 더미 데이터
      monthlyChangePercent: 0 // 더미 데이터
    };
  }, [stocks, assets]);

  return {
    stocks,
    transactions,
    watchlist,
    userBalance,
    userFuturesPositions: futuresPositionsWithPnl, // P&L 계산된 포지션 반환
    userFuturesTransactions,
    addTransaction,
    addToWatchlist,
    removeFromWatchlist,
    updateHolding,
    addHolding,
    deleteHolding,
    openFuturesPosition,
    closeFuturesPosition,
    addFuturesTransaction,
    updateUserBalance,
    getAssets: () => assets, // 메모이제이션된 값을 반환하는 함수
    getPortfolioSummary: () => portfolioSummary // 메모이제이션된 값을 반환하는 함수
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