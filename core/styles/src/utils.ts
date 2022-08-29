export const formatNumber = (n: number, maxDigits = 5) => {
  const digits = n.toString().split('.')[1];
  return digits && digits.length >= 5 ? n.toFixed(maxDigits) : n.toString();
};
