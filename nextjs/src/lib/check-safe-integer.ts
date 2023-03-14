export const checkSafeInteger = (value: unknown): value is number => {
  return Number.isSafeInteger(value);
};
