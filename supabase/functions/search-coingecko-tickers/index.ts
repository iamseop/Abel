import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CoinGecko API 키가 필요한 경우 Supabase Secrets에 설정하세요.
// COINGECKO_API_KEY: CoinGecko에서 발급받은 API 키 (무료 플랜은 보통 필요 없음)
const COINGECKO_API_KEY = Deno.env.get('COINGECKO_API_KEY');

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
    const { query } = await req.json(); // 검색 쿼리를 받음

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return new Response(JSON.stringify({ error: 'Search query is required' }), {
        headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const url = new URL('https://api.coingecko.com/api/v3/search');
    url.searchParams.append('query', query);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (COINGECKO_API_KEY) {
      headers['x-cg-pro-api-key'] = COINGECKO_API_KEY; // 유료 플랜 또는 API 키가 필요한 경우
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CoinGecko Search API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: `Failed to fetch data from CoinGecko Search API: ${response.statusText}. Details: ${errorText}` }), {
        headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    const data = await response.json();

    // CoinGecko 검색 결과에서 필요한 정보만 추출하여 반환
    // 'coins' 배열에 있는 항목만 필터링하고, 필요한 필드만 추출
    const coins = data.coins ? data.coins.map((coin: any) => ({
      id: coin.id, // CoinGecko 내부 ID (가격 조회 시 사용)
      symbol: coin.symbol.toUpperCase(), // 티커 심볼 (예: BTC)
      name: coin.name, // 코인 이름 (예: Bitcoin)
      market_cap_rank: coin.market_cap_rank, // 시가총액 순위
    })).filter((coin: any) => coin.market_cap_rank !== null) // 시가총액 순위가 있는 코인만 필터링
      .sort((a: any, b: any) => a.market_cap_rank - b.market_cap_rank) // 시가총액 순위로 정렬
    : [];

    return new Response(JSON.stringify(coins), {
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