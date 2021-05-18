export const config = {
  t: 3,
  threshold: 1,
  codeUnitSize: 16,
  args: (i: number) => {
    return i + 1;
  },
  messageDelimiter: (modMessage: number[], threshold: number) => {
    const delimiter = new Array(threshold * 3);
    for (let i = 0; i < delimiter.length; i += 1) delimiter[i] = 255;
    return delimiter;
  },
  messageCompleted: (data: Uint8ClampedArray, i: number) => {
    let done = true;
    for (let j = 0; j < 16 && done; j += 1) {
      done = done && data[i + j * 4] === 255;
    }
    return done;
  }
};
