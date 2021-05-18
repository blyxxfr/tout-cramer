export const isPrime = (n: number): boolean => {
  if (isNaN(n) || !isFinite(n) || n % 1 || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  if (n % 3 === 0) return n === 3;
  const m = Math.sqrt(n);
  for (let i = 5; i <= m; i += 6) {
    if (n % i === 0) return false;
    if (n % (i + 2) === 0) return false;
  }
  return true;
};