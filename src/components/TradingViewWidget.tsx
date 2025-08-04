import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
}

function TradingViewWidget({ symbol = "NASDAQ:AAPL" }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

  // 한국 주식 심볼을 트레이딩뷰 형식으로 변환
  const getTradingViewSymbol = (s: string) => {
    // 한국 주식의 경우 KRX: 접두사 추가
    if (s.match(/^\d{6}$/)) {
      return `KRX:${s}`;
    }
    // 암호화폐의 경우 USDT 접미사 추가 (바이낸스 기준)
    if (s === 'BTCUSD') return 'BINANCE:BTCUSDT';
    if (s === 'ETHUSD') return 'BINANCE:ETHUSDT';
    if (s === 'TRXUSD') return 'BINANCE:TRXUSDT';
    if (s === 'ETCUSD') return 'BINANCE:ETCUSDT';
    
    // 기타 경우는 그대로 사용
    return s;
  };

  useEffect(() => {
    if (!container.current) return;

    // 기존 스크립트 제거
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "allow_symbol_change": true,
      "calendar": false,
      "details": false,
      "hide_side_toolbar": false,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_volume": false,
      "hotlist": false,
      "interval": "D",
      "locale": "kr",
      "save_image": true,
      "style": "1",
      "symbol": getTradingViewSymbol(symbol), // 헬퍼 함수를 통해 심볼 변환
      "theme": "dark",
      "timezone": "Etc/UTC",
      "backgroundColor": "#111827",
      "gridColor": "rgba(242, 242, 242, 0.06)",
      "watchlist": [],
      "withdateranges": false,
      "compareSymbols": [],
      "studies": [],
      "autosize": true,
      "height": "100%",
      "width": "100%",
      "container_id": `tradingview_chart_${symbol.replace(':', '_').replace('.', '_')}`,
      "overrides": {
        "paneProperties.background": "#111827",
        "paneProperties.backgroundType": "solid"
      }
    });

    container.current.appendChild(script);

    // 클린업 함수
    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]); // symbol이 변경될 때만 useEffect가 다시 실행되도록

  return (
    <div className="w-full h-full relative">
      {/* 강제 배경 레이어 - 모든 영역 커버 */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundColor: "#111827",
          zIndex: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: "absolute"
        }}
      />
      
      {/* TradingView 컨테이너 */}
      <div 
        className="tradingview-widget-container relative w-full h-full" 
        ref={container}
        style={{ 
          height: "100%", 
          width: "100%",
          backgroundColor: "#111827",
          position: "relative",
          zIndex: 1,
          minHeight: "100%"
        }}
      >
        <div 
          className="tradingview-widget-container__widget w-full h-full" 
          style={{ 
            height: "100%", 
            width: "100%",
            backgroundColor: "#111827",
            position: "relative",
            minHeight: "100%"
          }}
        />
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);