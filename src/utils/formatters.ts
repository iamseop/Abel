export const formatNumber = (value: number | string, options?: Intl.NumberFormatOptions): string => {
  if (typeof value === 'string') {
    value = parseFloat(value.replace(/,/g, ''));
  }
  if (isNaN(value)) return '';

  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8, // 기본적으로 소수점 허용 (필요에 따라 조절)
  };

  return value.toLocaleString(undefined, { ...defaultOptions, ...options });
};

// 통화 금액을 소수점 없이 형식화
export const formatCurrencyNoDecimals = (value: number | string): string => {
  return formatNumber(value, { maximumFractionDigits: 0 });
};

// 백분율을 지정된 소수점 자릿수로 형식화
export const formatPercentage = (value: number | string, decimals: number = 1): string => {
  return formatNumber(value, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

// 입력 필드에서 숫자와 소수점만 허용하도록 정리
export const cleanNumericInput = (value: string): string => {
  let cleaned = value.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }
  return cleaned;
};

// 쉼표가 포함된 문자열을 숫자로 파싱
export const parseNumber = (value: string): number => {
  return parseFloat(value.replace(/,/g, '')) || 0;
};