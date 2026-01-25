export const formatNaira = (amount: number): string => {
  try {
    return `₦ ${Math.round(amount).toLocaleString()}`;
  } catch {
    return `₦ ${amount}`;
  }
};

