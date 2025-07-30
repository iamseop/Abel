import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

// 바이낸스 API 키는 환경 변수로 설정하는 것이 안전합니다.
// firebase functions:config:set binance.api_key="YOUR_API_KEY" binance.api_secret="YOUR_API_SECRET"
// 실제 사용 시에는 API 키와 시크릿을 직접 코드에 넣지 마세요.
const BINANCE_API_BASE_URL = "https://api.binance.com/api/v3";

export const getBinancePrice = functions.https.onCall(async (data, context) => {
  // 인증된 사용자만 호출할 수 있도록 하려면 아래 주석을 해제하세요.
  // if (!context.auth) {
  //   throw new functions.https.HttpsError(
  //     "unauthenticated",
  //     "The function must be called while authenticated."
  //   );
  // }

  const symbol = data.symbol as string; // 예: "BTCUSDT"

  if (!symbol) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Symbol is required."
    );
  }

  try {
    const response = await axios.get(`${BINANCE_API_BASE_URL}/ticker/price`, {
      params: { symbol: symbol.toUpperCase() },
    });

    const price = parseFloat(response.data.price);
    return { symbol: symbol.toUpperCase(), price: price };
  } catch (error: any) {
    functions.logger.error("Error fetching Binance price:", error.message);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to fetch price from Binance.",
      error.message
    );
  }
});

// 여러 종목의 시세를 한 번에 가져오는 함수 (선택 사항)
export const getBinancePrices = functions.https.onCall(async (data, context) => {
  const symbols = data.symbols as string[]; // 예: ["BTCUSDT", "ETHUSDT"]

  if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Symbols array is required."
    );
  }

  try {
    const prices = await Promise.all(symbols.map(async (symbol) => {
      const response = await axios.get(`${BINANCE_API_BASE_URL}/ticker/price`, {
        params: { symbol: symbol.toUpperCase() },
      });
      return { symbol: symbol.toUpperCase(), price: parseFloat(response.data.price) };
    }));
    return prices;
  } catch (error: any) {
    functions.logger.error("Error fetching multiple Binance prices:", error.message);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to fetch prices from Binance.",
      error.message
    );
  }
});