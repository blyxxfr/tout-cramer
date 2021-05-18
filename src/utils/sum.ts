import { Options } from "./options";

export const sum = (
  func: (n: number) => number,
  end: number,
  options: Options = {}
) => {
  let sum = 0;
  for (let i = options.start || 0; i < end; i += options.inc || 1)
    sum += func(i) || 0;

  return sum === 0 && options.defValue ? options.defValue : sum;
};
