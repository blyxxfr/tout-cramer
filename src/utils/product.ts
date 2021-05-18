import { Options } from "./options";

export const product = (
  func: (n: number) => number,
  end: number,
  options: Options = {}
) => {
  let prod = 1;
  for (let i = options.start || 0; i < end; i += options.inc || 1)
    prod *= func(i) || 1;
  return prod === 1 && options.defValue ? options.defValue : prod;
};
