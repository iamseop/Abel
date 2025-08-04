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
    const { ids, vs_currencies } = await req.json(); // CoinGecko ID (예: bitcoin, ethereum) 및 통화 (예: usd, krw) 배열을 받음

    if (!ids || !Array.isArray(ids) || ids.length === 0 || !vs_currencies || !Array.isArray(vs_currencies) || vs_currencies.length === 0) {
      return new Response(JSON.stringify({ error: 'CoinGecko IDs and vs_currencies arrays are required' }), {
        headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const url = new URL('https://api.coingecko.com/api/v3/simple/price');
    url.searchParams.append('ids', ids.join(','));
    url.searchParams.append('vs_currencies', vs_currencies.join(','));
    url.searchParams.append('include_24hr_change', 'true'); // 24시간 변동률 포함

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
      console.error('CoinGecko API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: `Failed to fetch data from CoinGecko API: ${response.statusText}. Details: ${errorText}` }), {
        headers: { ...dynamicCorsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      });
    }

    const data = await response.json();

    // CoinGecko 응답을 앱의 Stock 인터페이스에 맞게 변환
    const cryptoPrices = ids.map((id: string) => {
      const priceData = data[id];
      if (!priceData) {
        return { symbol: id.toUpperCase(), price: 0, change: 0, changePercent: 0, error: `No data for ${id}` };
      }
      const krwPrice = priceData.krw || 0;
      const krw24hrChange = priceData.krw_24hr_change || 0;

      return {
        symbol: id.toUpperCase(), // 예: BITCOIN, ETHEREUM
        name: id.charAt(0).toUpperCase() + id.slice(1), // 예: Bitcoin, Ethereum
        price: krwPrice,
        change: krw24hrChange, // CoinGecko는 24시간 변동 금액을 직접 제공하지 않으므로, %를 사용하거나 계산해야 함
        changePercent: krw24hrChange, // 24시간 변동률을 직접 사용
        volume: 0, // CoinGecko simple price 엔드포인트는 볼륨을 제공하지 않음
      };
    });

    return new Response(JSON.stringify(cryptoPrices), {
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