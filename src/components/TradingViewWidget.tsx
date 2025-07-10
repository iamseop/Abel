import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  onClose?: () => void;
}

function TradingViewWidget({ symbol = "NASDAQ:AAPL", onClose }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);

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
      "symbol": symbol,
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
      "container_id": `tradingview_chart_${Date.now()}`,
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
  }, [symbol]);

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