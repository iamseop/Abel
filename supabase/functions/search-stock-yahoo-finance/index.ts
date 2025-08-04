import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

// RapidAPI에서 Yahoo Finance API를 구독하고 얻은 호스트와 키를 Supabase Secrets에 설정해야 합니다.
// Supabase 대시보드 -> Edge Functions -> Manage Secrets 에서 추가하세요.
// YAHOO_FINANCE_API_HOST: 예를 들어, 'yahoo-finance-real-time1.p.rapidapi.com'
// YAHOO_FINANCE_API_KEY: RapidAPI에서 발급받은 API 키
const YAHOO_FINANCE_API_HOST = Deno.env.get('YAHOO_FINANCE_API_HOST');
const YAHOO_FINANCE_API_KEY = Deno.env.get('YAHOO_FINANCE_API_KEY');

serve(async (req) => {
  const requestOrigin = req.headers.get('Origin');
  
  const dynamicCorsHeaders = {
    'Access-Control-Allow-Origin': requestOrigin || '*', // 모든 Origin 허용 (테스트용)
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
    const { symbol } = await req.json();

    if (!symbol) {
      return new Response(JSON.stringify({ error: 'Symbol is required' }), {
        headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (!YAHOO_FINANCE_API_HOST || !YAHOO_FINANCE_API_KEY) {
      console.error('Yahoo Finance API credentials are not set.');
      return new Response(JSON.stringify({ error: 'Yahoo Finance API credentials are not set in Supabase Secrets.' }), {
        headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Yahoo Finance API 검색 엔드포인트 수정: /v1/finance/search 사용
    const url = `https://${YAHOO_FINANCE_API_HOST}/v1/finance/search?q=${encodeURIComponent(symbol)}&lang=en`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': YAHOO_FINANCE_API_HOST,
        'X-RapidAPI-Key': YAHOO_FINANCE_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Yahoo Finance API error:', response.status, errorText);
      return new Response(JSON.stringify({ 
        error: `Failed to fetch data from Yahoo Finance API: ${response.statusText}. Details: ${errorText}` 
      }), {
        headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    const data = await response.json();

    // 응답에 quotes 배열이 있는지 확인하고, 없으면 빈 배열 반환
    if (!data || !Array.isArray(data.quotes)) {
      console.warn('Yahoo Finance API did not return a quotes array:', data);
      return new Response(JSON.stringify([]), {
        headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Yahoo Finance API 응답에서 필요한 정보만 추출하여 반환
    const stocks = data.quotes.map((quote: any) => ({
      symbol: quote.symbol,
      name: quote.longname || quote.shortname || quote.symbol,
      exchange: quote.exchange,
      type: quote.quoteType,
      // search 엔드포인트는 실시간 가격을 포함하지 않을 수 있으므로, 기본값 설정
      price: quote.regularMarketPrice || 0, 
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
    }));

    return new Response(JSON.stringify(stocks), {
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