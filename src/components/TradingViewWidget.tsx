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
      "backgroundColor": "rgba(17, 24, 39, 1)",
      "gridColor": "rgba(242, 242, 242, 0.06)",
      "watchlist": [],
      "withdateranges": false,
      "compareSymbols": [],
      "studies": [],
      "autosize": true,
      "height": "100%",
      "width": "100%",
      "container_id": "tradingview_chart"
    });

    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div 
      className="tradingview-widget-container w-full h-full bg-gray-900" 
      ref={container}
      style={{ 
        height: "100%", 
        width: "100%",
        backgroundColor: "#111827",
        overflow: "hidden"
      }}
    >
      <div 
        className="tradingview-widget-container__widget w-full h-full bg-gray-900" 
        style={{ 
          height: "100%", 
          width: "100%",
          backgroundColor: "#111827"
        }}
      ></div>
    </div>
  );
}

export default memo(TradingViewWidget);