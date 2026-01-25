export const SERVICE_FEE_RATE = 0.075;

export const calculateServiceFee = (subtotal: number, rate: number = SERVICE_FEE_RATE) => {
  return Math.max(0, subtotal * rate);
};

export const calculateTotal = (subtotal: number, fee: number) => {
  return Math.max(0, subtotal + fee);
};

