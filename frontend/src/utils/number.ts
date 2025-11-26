/**
 * Safely format a number to fixed decimal places
 * Returns '0.00' if value is not a valid number
 */
export const safeToFixed = (value: any, decimals: number = 2): string => {
  const num = parseFloat(String(value));
  if (isNaN(num) || !isFinite(num)) {
    return '0.' + '0'.repeat(decimals);
  }
  return num.toFixed(decimals);
};

/**
 * Safely format a number as currency
 */
export const formatCurrency = (value: any, decimals: number = 2): string => {
  return `¥${safeToFixed(value, decimals)}`;
};

/**
 * Safely format a number as percentage
 */
export const formatPercentage = (value: any, decimals: number = 1): string => {
  return `${safeToFixed(value, decimals)}%`;
};

/**
 * Safely parse a number from any value
 */
export const safeParseFloat = (value: any, defaultValue: number = 0): number => {
  const num = parseFloat(String(value));
  if (isNaN(num) || !isFinite(num)) {
    return defaultValue;
  }
  return num;
};
