export const formatNumber = (n: number, maxDigits = 5) => {
  const digits = n.toString().split('.')[1];
  return digits && digits.length >= maxDigits
    ? n.toFixed(maxDigits)
    : n.toString();
};
