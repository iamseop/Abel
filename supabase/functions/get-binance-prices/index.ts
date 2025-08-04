import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// RapidAPI에서 Binance API를 구독하고 얻은 호스트와 키를 Supabase Secrets에 설정해야 합니다.
// Supabase 대시보드 -> Edge Functions -> Manage Secrets 에서 추가하세요.
// BINANCE_API_HOST: 예를 들어, 'binance-api28.p.rapidapi.com'
// BINANCE_API_KEY: RapidAPI에서 발급받은 API 키
const BINANCE_API_HOST = Deno.env.get('BINANCE_API_HOST');
const BINANCE_API_KEY = Deno.env.get('BINANCE_API_KEY');

serve(async (req) => {
  const requestOrigin = req.headers.get('Origin');
  
  const dynamicCorsHeaders = {
    'Access-Control-Allow-Origin': requestOrigin || '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };

  // OPTIONS 요청 처리 (CORS Preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: dynamicCorsHeaders });
  }

  try {
    const { symbols } = await req.json(); // symbols 배열을 받음

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(JSON.stringify({ error: 'Symbols array is required' }), {
        headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (!BINANCE_API_HOST || !BINANCE_API_KEY) {
      console.error('Binance API credentials are not set.');
      return new Response(JSON.stringify({ error: 'Binance API credentials are not set in Supabase Secrets.' }), {
        headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const prices = await Promise.all(symbols.map(async (symbol: string) => {
      const url = `https://${BINANCE_API_HOST}/v1/ticker/24hr?symbol=${symbol.toUpperCase()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Host': BINANCE_API_HOST,
          'X-RapidAPI-Key': BINANCE_API_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Binance API error for ${symbol}:`, response.status, errorText);
        // 개별 종목 실패 시에도 다른 종목은 계속 처리
        return { symbol: symbol.toUpperCase(), price: 0, error: `Failed to fetch price: ${response.statusText}` };
      }

      const data = await response.json();
      return { symbol: symbol.toUpperCase(), price: parseFloat(data.lastPrice) };
    }));

    return new Response(JSON.stringify(prices), {
      headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});