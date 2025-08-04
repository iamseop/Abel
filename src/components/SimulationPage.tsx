import React, { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, PieChart, BarChart3, Target, Award, AlertCircle, Plus, Minus, ArrowRight, ArrowLeft, History } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import Modal from './Modal';
import { formatCurrencyNoDecimals, formatNumber, formatPercentage, cleanNumericInput, parseNumber } from '../utils/formatters';
import { Stock } from '../types';
import { showSuccess, showError } from '../utils/toast';
import TradingViewWidget from './TradingViewWidget'; // TradingViewWidget 임포트
import OrderBook from './simulation/OrderBook'; // OrderBook 컴포넌트 임포트

// 임시 더미 데이터 (실제 API가 작동하지 않을 때 사용)
const dummyCryptoSymbols = [
  { symbol: 'BTCUSDT', name: '비트코인', currentPrice: 0 },
  { symbol: 'ETHUSDT', name: '이더리움', currentPrice: 0 },
];

const SimulationPage: React.FC = () => {
  const { 
    stocks, 
    userBalance, 
    userFuturesPositions, 
    userFuturesTransactions,
    openFuturesPosition, 
    closeFuturesPosition,
    updateUserBalance
  } = usePortfolio();

  // 기본 활성 탭을 'futures'로 설정
  const [activeTab, setActiveTab] = useState<'futures' | 'transactions' | 'ranking'>('futures');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSymbol, setOrderSymbol] = useState('BTCUSD'); // 내부 심볼 사용
  const [orderSide, setOrderSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [orderQuantity, setOrderQuantity] = useState('');
  const [orderLeverage, setOrderLeverage] = useState('10');
  const [showDepositWithdrawModal, setShowDepositWithdrawModal] = useState(false);
  const [depositWithdrawAmount, setDepositWithdrawAmount] = useState('');
  const [depositWithdrawType, setDepositWithdrawType] = useState<'deposit' | 'withdraw'>('deposit');

  const currentCryptoPrice = useMemo(() => {
    return stocks.find(s => s.symbol === orderSymbol)?.price || 0;
  }, [stocks, orderSymbol]);

  const handleOpenOrderModal = (symbol: string) => {
    setOrderSymbol(symbol);
    setShowOrderModal(true);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseNumber(orderQuantity);
    const leverage = parseNumber(orderLeverage);
    const price = currentCryptoPrice;

    if (!quantity || !leverage || !price) {
      showError('모든 필드를 입력하고 유효한 가격이 있어야 합니다.');
      return;
    }
    if (quantity <= 0 || leverage <= 0) {
      showError('수량과 레버리지는 0보다 커야 합니다.');
      return;
    }

    await openFuturesPosition(orderSymbol, orderSide, quantity, price, leverage);
    setShowOrderModal(false);
    setOrderQuantity('');
  };

  const handleClosePosition = async (position: FuturesPosition) => {
    const closePrice = stocks.find(s => s.symbol === position.symbol)?.price || 0;
    if (closePrice === 0) {
      showError('현재 가격을 가져올 수 없어 포지션을 청산할 수 없습니다.');
      return;
    }
    await closeFuturesPosition(
      position.id,
      position.symbol,
      position.position_side,
      position.quantity,
      position.entry_price,
      position.leverage,
      closePrice
    );
  };

  const handleDepositWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseNumber(depositWithdrawAmount);
    if (amount <= 0) {
      showError('금액은 0보다 커야 합니다.');
      return;
    }
    if (depositWithdrawType === 'withdraw' && amount > userBalance) {
      showError('출금하려는 금액이 잔고보다 많습니다.');
      return;
    }
    await updateUserBalance(amount, depositWithdrawType);
    setShowDepositWithdrawModal(false);
    setDepositWithdrawAmount('');
  };

  const renderFuturesOverview = () => {
    const totalUnrealizedPnl = userFuturesPositions.reduce((sum, pos) => sum + (pos.unrealized_pnl || 0), 0);
    const totalInitialMargin = userFuturesPositions.reduce((sum, pos) => sum + (pos.quantity * pos.entry_price / pos.leverage), 0);
    const totalRealizedPnl = userFuturesTransactions
      .filter(t => t.type.startsWith('CLOSE_'))
      .reduce((sum, t) => {
        // 간단한 실현 손익 계산 (실제로는 더 복잡할 수 있음)
        const entryPrice = userFuturesPositions.find(p => p.symbol === t.symbol && p.position_side === t.type.replace('CLOSE_', ''))?.entry_price || 0;
        if (t.type === 'CLOSE_LONG') {
          return sum + (t.price - entryPrice) * t.quantity * (t.leverage || 1);
        } else if (t.type === 'CLOSE_SHORT') {
          return sum + (entryPrice - t.price) * t.quantity * (t.leverage || 1);
        }
        return sum;
      }, 0);

    return (
      <div className="space-y-4">
        {/* 잔고 및 손익 요약 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-[var(--text-accent-blue)]" />
              <h3 className="text-[var(--text-tertiary)] text-xs">총 잔고</h3>
            </div>
            <p className="text-xl font-bold text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(userBalance)}</p>
            <div className="flex gap-2 mt-4">
              <button 
                onClick={() => { setDepositWithdrawType('deposit'); setShowDepositWithdrawModal(true); }}
                className="flex-1 py-2 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] text-[var(--text-primary)] text-sm rounded-lg transition-colors"
              >
                입금
              </button>
              <button 
                onClick={() => { setDepositWithdrawType('withdraw'); setShowDepositWithdrawModal(true); }}
                className="flex-1 py-2 bg-[var(--button-default-bg)] hover:bg-[var(--button-default-hover-bg)] text-[var(--text-primary)] text-sm rounded-lg transition-colors"
              >
                출금
              </button>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-[var(--text-accent-purple)]" />
              <h3 className="text-[var(--text-tertiary)] text-xs">미실현 손익</h3>
            </div>
            <p className={`text-xl font-bold ${totalUnrealizedPnl >= 0 ? 'text-[var(--text-accent-green)]' : 'text-[var(--text-accent-red)]'}`}>
              {totalUnrealizedPnl >= 0 ? '+' : ''}₩{formatCurrencyNoDecimals(totalUnrealizedPnl)}
            </p>
            <p className="text-[var(--text-secondary)] text-xs mt-2">
              총 증거금: ₩{formatCurrencyNoDecimals(totalInitialMargin)}
            </p>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-[var(--text-accent-yellow)]" />
              <h3 className="text-[var(--text-tertiary)] text-xs">실현 손익</h3>
            </div>
            <p className={`text-xl font-bold ${totalRealizedPnl >= 0 ? 'text-[var(--text-accent-green)]' : 'text-[var(--text-accent-red)]'}`}>
              {totalRealizedPnl >= 0 ? '+' : ''}₩{formatCurrencyNoDecimals(totalRealizedPnl)}
            </p>
            <p className="text-[var(--text-secondary)] text-xs mt-2">
              총 거래 횟수: {userFuturesTransactions.length}회
            </p>
          </div>
        </div>

        {/* 현재 포지션 목록 */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">현재 포지션</h2>
          {userFuturesPositions.length === 0 ? (
            <div className="text-center py-8">
              <PieChart className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
              <p className="text-[var(--text-secondary)] mb-2">보유한 선물 포지션이 없습니다.</p>
              <button 
                onClick={() => setActiveTab('futures')}
                className="px-4 py-2 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] text-[var(--text-primary)] rounded-lg transition-colors"
              >
                새 포지션 개설하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userFuturesPositions.map(position => {
                const currentPrice = stocks.find(s => s.symbol === position.symbol)?.price || 0;
                const initialMargin = (position.quantity * position.entry_price) / position.leverage;
                
                return (
                  <div key={position.id} className="p-4 bg-[var(--input-background)] rounded-lg border border-[var(--input-border)]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[var(--text-primary)] font-semibold text-base">
                        {position.symbol} ({position.position_side === 'LONG' ? '롱' : '숏'})
                      </h3>
                      <span className={`text-sm font-bold ${
                        (position.unrealized_pnl || 0) >= 0 ? 'text-[var(--text-accent-green)]' : 'text-[var(--text-accent-red)]'
                      }`}>
                        {formatPercentage(position.unrealized_pnl_percent || 0, 2)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]">
                      <div>
                        <p>수량: <span className="text-[var(--text-primary)]">{formatNumber(position.quantity)}</span></p>
                        <p>진입가: <span className="text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(position.entry_price)}</span></p>
                        <p>레버리지: <span className="text-[var(--text-primary)]">{position.leverage}x</span></p>
                      </div>
                      <div>
                        <p>현재가: <span className="text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(currentPrice)}</span></p>
                        <p>미실현 손익: <span className={`font-bold ${
                          (position.unrealized_pnl || 0) >= 0 ? 'text-[var(--text-accent-green)]' : 'text-[var(--text-accent-red)]'
                        }`}>
                          {formatCurrencyNoDecimals(position.unrealized_pnl || 0)}
                        </span></p>
                        <p>증거금: <span className="text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(initialMargin)}</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleClosePosition(position)}
                      className="mt-4 w-full py-2 bg-[var(--button-danger-bg)] hover:bg-[var(--button-danger-hover-bg)] text-[var(--text-primary)] rounded-lg text-sm transition-colors"
                    >
                      포지션 청산
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFuturesTrading = () => {
    const availableCryptoStocks = stocks.filter(s => ['BTCUSD', 'ETHUSD', 'TRXUSD', 'ETCUSD'].includes(s.symbol));
    const estimatedMargin = (parseNumber(orderQuantity) * currentCryptoPrice) / parseNumber(orderLeverage);

    return (
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">선물 거래</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 주문 입력 폼 */}
          <form onSubmit={handlePlaceOrder} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">종목</label>
              <select
                value={orderSymbol}
                onChange={(e) => setOrderSymbol(e.target.value)}
                className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none"
              >
                {availableCryptoStocks.map(s => (
                  <option key={s.symbol} value={s.symbol}>{s.name} ({s.symbol})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">매수/매도</label>
              <div className="flex bg-[var(--input-background)] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setOrderSide('LONG')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    orderSide === 'LONG'
                      ? 'bg-[var(--text-accent-green)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  롱 (매수)
                </button>
                <button
                  type="button"
                  onClick={() => setOrderSide('SHORT')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    orderSide === 'SHORT'
                      ? 'bg-[var(--text-accent-red)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  숏 (매도)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">수량</label>
              <input
                type="text"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(cleanNumericInput(e.target.value))}
                className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                placeholder="0.001"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">레버리지</label>
              <input
                type="text"
                value={orderLeverage}
                onChange={(e) => setOrderLeverage(cleanNumericInput(e.target.value))}
                className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
                placeholder="10"
                required
              />
            </div>

            <div className="bg-[var(--input-background)] p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--text-tertiary)]">현재가:</span>
                <span className="text-[var(--text-primary)] font-semibold">₩{formatCurrencyNoDecimals(currentCryptoPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[var(--text-tertiary)]">예상 증거금:</span>
                <span className="text-[var(--text-primary)] font-semibold">
                  ₩{formatCurrencyNoDecimals((parseNumber(orderQuantity) * currentCryptoPrice) / parseNumber(orderLeverage))}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!orderQuantity || !orderLeverage || parseNumber(orderQuantity) <= 0 || parseNumber(orderLeverage) <= 0 || ((parseNumber(orderQuantity) * currentCryptoPrice) / parseNumber(orderLeverage)) > userBalance}
              className={`w-full py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                orderSide === 'LONG'
                  ? 'bg-[var(--text-accent-green)] hover:bg-[var(--text-accent-green)] text-[var(--text-primary)]'
                  : 'bg-[var(--text-accent-red)] hover:bg-[var(--text-accent-red)] text-[var(--text-primary)]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {orderSide === 'LONG' ? '롱 포지션 개설' : '숏 포지션 개설'}
            </button>
          </form>

          {/* 현재 포지션 요약 */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[var(--text-primary)]">나의 선물 포지션</h3>
            {userFuturesPositions.length === 0 ? (
              <div className="bg-[var(--input-background)] p-4 rounded-lg text-center text-[var(--text-secondary)]">
                개설된 포지션이 없습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {userFuturesPositions.map(position => (
                  <div key={position.id} className="p-4 bg-[var(--input-background)] rounded-lg border border-[var(--input-border)]">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[var(--text-primary)] font-semibold text-base">
                        {position.symbol} ({position.position_side === 'LONG' ? '롱' : '숏'})
                      </h3>
                      <span className={`text-sm font-bold ${
                        (position.unrealized_pnl || 0) >= 0 ? 'text-[var(--text-accent-green)]' : 'text-[var(--text-accent-red)]'
                      }`}>
                        {formatPercentage(position.unrealized_pnl_percent || 0, 2)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]">
                      <div>
                        <p>수량: <span className="text-[var(--text-primary)]">{formatNumber(position.quantity)}</span></p>
                        <p>진입가: <span className="text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(position.entry_price)}</span></p>
                        <p>레버리지: <span className="text-[var(--text-primary)]">{position.leverage}x</span></p>
                      </div>
                      <div>
                        <p>현재가: <span className="text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(currentPrice)}</span></p>
                        <p>미실현 손익: <span className={`font-bold ${
                          (position.unrealized_pnl || 0) >= 0 ? 'text-[var(--text-accent-green)]' : 'text-[var(--text-accent-red)]'
                        }`}>
                          {formatCurrencyNoDecimals(position.unrealized_pnl || 0)}
                        </span></p>
                        <p>증거금: <span className="text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(initialMargin)}</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleClosePosition(position)}
                      className="mt-4 w-full py-2 bg-[var(--button-danger-bg)] hover:bg-[var(--button-danger-hover-bg)] text-[var(--text-primary)] rounded-lg text-sm transition-colors"
                    >
                      포지션 청산
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTransactions = () => (
    <div className="glass-card p-6">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">선물 거래 내역</h2>
      {userFuturesTransactions.length === 0 ? (
        <div className="text-center py-8">
          <History className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">선물 거래 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {userFuturesTransactions.map(tx => (
            <div key={tx.id} className="p-3 bg-[var(--input-background)] rounded-lg border border-[var(--input-border)]">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold text-[var(--text-primary)]">{tx.symbol}</span>
                <span className="text-[var(--text-secondary)] text-xs">
                  {new Date(tx.transaction_time).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                <p>유형: <span className="text-[var(--text-primary)]">{tx.type}</span></p>
                <p>수량: <span className="text-[var(--text-primary)]">{formatNumber(tx.quantity)}</span></p>
                <p>가격: <span className="text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(tx.price)}</span></p>
                {tx.leverage && <p>레버리지: <span className="text-[var(--text-primary)]">{tx.leverage}x</span></p>}
                {tx.fee && <p>수수료: <span className="text-[var(--text-primary)]">₩{formatCurrencyNoDecimals(tx.fee)}</span></p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRanking = () => (
    <div className="glass-card p-6">
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">모의투자 랭킹</h2>
      <div className="bg-yellow-500/10 border border-[var(--text-accent-yellow)]/20 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-[var(--text-accent-yellow)]" />
          <p className="text-[var(--text-accent-yellow)] font-medium">개발 중인 기능입니다</p>
        </div>
        <p className="text-[var(--text-tertiary)] text-xs mt-2">
          다른 사용자들과의 수익률 비교 기능이 곧 추가될 예정입니다.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-[var(--text-accent-green)]" />
          <h1 className="text-xl font-bold text-[var(--text-primary)]">모의투자</h1>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('futures')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'futures'
              ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)]'
              : 'bg-[var(--input-background)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--button-default-hover-bg)]'
          }`}
        >
          선물 거래
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)]'
              : 'bg-[var(--input-background)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--button-default-hover-bg)]'
          }`}
        >
          거래 내역
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'ranking'
              ? 'bg-[var(--button-primary-bg)] text-[var(--text-primary)]'
              : 'bg-[var(--input-background)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--button-default-hover-bg)]'
          }`}
        >
          랭킹
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === 'futures' && (
        <>
          {/* 메인 레이아웃: 차트 + 주문 섹션 (상단) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 h-[60vh]"> {/* 높이 고정 */}
            {/* 차트 섹션 (왼쪽) */}
            <div className="lg:col-span-2 glass-card p-0 flex flex-col overflow-hidden"> {/* p-0으로 내부 패딩 제거 */}
              <div className="flex items-center gap-3 p-4 sm:p-6 border-b border-[var(--card-border)]">
                <BarChart3 className="w-6 h-6 text-[var(--text-accent-blue)]" />
                <h2 className="text-lg font-bold text-[var(--text-primary)]">실시간 차트</h2>
              </div>
              <div className="flex-1 relative">
                <TradingViewWidget symbol={orderSymbol} />
              </div>
            </div>

            {/* 호가창 섹션 (오른쪽) */}
            <div className="lg:col-span-1 glass-card p-0 flex flex-col overflow-hidden">
              <OrderBook symbol={orderSymbol} currentPrice={currentCryptoPrice} />
            </div>
          </div>
          {renderFuturesOverview()}
        </>
      )}
      {activeTab === 'transactions' && renderTransactions()}
      {activeTab === 'ranking' && renderRanking()}

      {/* 모의투자 안내 */}
      <div 
        className="glass-card p-6"
        style={{ background: 'linear-gradient(to right, var(--gradient-info-blue-start), var(--gradient-info-blue-end))' }}
      >
        <h3 className="text-[var(--text-primary)] font-bold text-base mb-4">💡 모의투자란?</h3>
        <div className="space-y-2 text-[var(--text-tertiary)] text-xs">
          <p>• 실제 돈을 사용하지 않고 가상의 자금으로 투자를 체험할 수 있습니다</p>
          <p>• 실시간 주가 데이터를 바탕으로 실제와 동일한 환경에서 투자 연습이 가능합니다</p>
          <p>• 다양한 투자 전략을 시험해보고 위험 없이 경험을 쌓을 수 있습니다</p>
          <p>• 다른 사용자들과 수익률을 비교하며 실력을 향상시킬 수 있습니다</p>
        </div>
      </div>

      {/* 주문 모달 */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        title={`${orderSymbol} ${orderSide === 'LONG' ? '롱' : '숏'} 주문`}
        contentClassName="max-w-lg" // 주문 모달 크기 조정
      >
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">수량</label>
            <input
              type="text"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(cleanNumericInput(e.target.value))}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="0.001"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">레버리지</label>
            <input
              type="text"
              value={orderLeverage}
              onChange={(e) => setOrderLeverage(cleanNumericInput(e.target.value))}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="10"
              required
            />
          </div>
          <div className="bg-[var(--input-background)] p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-tertiary)]">현재가:</span>
              <span className="text-[var(--text-primary)] font-semibold">₩{formatCurrencyNoDecimals(currentCryptoPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-tertiary)]">예상 증거금:</span>
              <span className="text-[var(--text-primary)] font-semibold">
                ₩{formatCurrencyNoDecimals((parseNumber(orderQuantity) * currentCryptoPrice) / parseNumber(orderLeverage))}
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={!orderQuantity || !orderLeverage || parseNumber(orderQuantity) <= 0 || parseNumber(orderLeverage) <= 0 || ((parseNumber(orderQuantity) * currentCryptoPrice) / parseNumber(orderLeverage)) > userBalance}
            className={`w-full py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              orderSide === 'LONG'
                ? 'bg-[var(--text-accent-green)] hover:bg-[var(--text-accent-green)] text-[var(--text-primary)]'
                : 'bg-[var(--text-accent-red)] hover:bg-[var(--text-accent-red)] text-[var(--text-primary)]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {orderSide === 'LONG' ? '롱 포지션 개설' : '숏 포지션 개설'}
          </button>
        </form>
      </Modal>

      {/* 입금/출금 모달 */}
      <Modal
        isOpen={showDepositWithdrawModal}
        onClose={() => setShowDepositWithdrawModal(false)}
        title={`${depositWithdrawType === 'deposit' ? '입금' : '출금'}`}
        contentClassName="max-w-md" // 입금/출금 모달 크기 조정
      >
        <form onSubmit={handleDepositWithdraw} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-tertiary)] mb-2">금액 (원)</label>
            <input
              type="text"
              value={depositWithdrawAmount}
              onChange={(e) => setDepositWithdrawAmount(cleanNumericInput(e.target.value))}
              className="w-full p-3 bg-[var(--input-background)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:border-[var(--input-focus-border)] focus:outline-none placeholder:text-[var(--input-placeholder)]"
              placeholder="100,000"
              required
            />
          </div>
          <button
            type="submit"
            disabled={parseNumber(depositWithdrawAmount) <= 0 || (depositWithdrawType === 'withdraw' && parseNumber(depositWithdrawAmount) > userBalance)}
            className={`w-full py-3 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              depositWithdrawType === 'deposit'
                ? 'bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-hover-bg)] text-[var(--text-primary)]'
                : 'bg-[var(--button-danger-bg)] hover:bg-[var(--button-danger-hover-bg)] text-[var(--text-primary)]'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {depositWithdrawType === 'deposit' ? '입금하기' : '출금하기'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default SimulationPage;