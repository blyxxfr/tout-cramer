import { isPrime } from "./is-prime";

export const findNextPrime = (n: number): number => {
  for (let i = n; true; i += 1) if (isPrime(i)) return i;
};
