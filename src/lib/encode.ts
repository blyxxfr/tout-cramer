import * as path from "path";
import { config } from "../config";
import { findNextPrime } from "../utils/next-prime";
import { createCanvas, loadImage } from "canvas";

export const encode = async (message: string) => {
  const image = await loadImage(
    path.join(__dirname, "..", "assets", "tout-cramer.jpg")
  );

  const t = config.t,
    threshold = config.threshold,
    codeUnitSize = config.codeUnitSize,
    prime = findNextPrime(Math.pow(2, t)),
    args = config.args,
    messageDelimiter = config.messageDelimiter;

  if (!t || t < 1 || t > 7)
    throw new Error(
      'IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8'
    );

  const shadowCanvas = createCanvas(image.width, image.height),
    shadowCtx = shadowCanvas.getContext("2d");

  if (shadowCtx) {
    shadowCtx.drawImage(image, 0, 0);
    const imageData = shadowCtx.getImageData(
        0,
        0,
        shadowCanvas.width,
        shadowCanvas.height
      ),
      data = imageData.data;

    // bundlesPerChar ... Count of full t-bit-sized bundles per Character
    // overlapping ... Count of bits of the currently handled character which are not handled during each run
    // dec ... UTF-16 Unicode of the i-th character of the message
    // curOverlapping ... The count of the bits of the previous character not handled in the previous run
    // mask ... The raw initial bitmask, will be changed every run and if bits are overlapping
    let bundlesPerChar = (codeUnitSize / t) >> 0,
      overlapping = codeUnitSize % t,
      modMessage = [],
      decM,
      oldDec,
      oldMask,
      left,
      right,
      dec,
      curOverlapping,
      mask;
    let i, j;
    for (i = 0; i <= message.length; i += 1) {
      dec = message.charCodeAt(i) || 0;
      curOverlapping = (overlapping * i) % t;
      if (curOverlapping > 0 && oldDec) {
        // Mask for the new character, shifted with the count of overlapping bits
        mask = Math.pow(2, t - curOverlapping) - 1;
        // Mask for the old character, i.e. the t-curOverlapping bits on the right
        // of that character
        oldMask =
          Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -curOverlapping));
        left = (dec & mask) << curOverlapping;
        right = (oldDec & oldMask) >> (codeUnitSize - curOverlapping);
        modMessage.push(left + right);

        if (i < message.length) {
          mask = Math.pow(2, 2 * t - curOverlapping) * (1 - Math.pow(2, -t));
          for (j = 1; j < bundlesPerChar; j += 1) {
            decM = dec & mask;
            modMessage.push(decM >> ((j - 1) * t + (t - curOverlapping)));
            mask <<= t;
          }
          if ((overlapping * (i + 1)) % t === 0) {
            mask = Math.pow(2, codeUnitSize) * (1 - Math.pow(2, -t));
            decM = dec & mask;
            modMessage.push(decM >> (codeUnitSize - t));
          } else if (
            ((overlapping * (i + 1)) % t) + (t - curOverlapping) <=
            t
          ) {
            decM = dec & mask;
            modMessage.push(
              decM >> ((bundlesPerChar - 1) * t + (t - curOverlapping))
            );
          }
        }
      } else if (i < message.length) {
        mask = Math.pow(2, t) - 1;
        for (j = 0; j < bundlesPerChar; j += 1) {
          decM = dec & mask;
          modMessage.push(decM >> (j * t));
          mask <<= t;
        }
      }
      oldDec = dec;
    }

    // Write Data
    let offset,
      index,
      subOffset,
      delimiter = messageDelimiter(modMessage, threshold),
      q,
      qS;
    for (
      offset = 0;
      (offset + threshold) * 4 <= data.length &&
      offset + threshold <= modMessage.length;
      offset += threshold
    ) {
      qS = [];
      for (i = 0; i < threshold && i + offset < modMessage.length; i += 1) {
        q = 0;
        for (
          j = offset;
          j < threshold + offset && j < modMessage.length;
          j += 1
        )
          q += modMessage[j] * Math.pow(args(i), j - offset);
        qS[i] = 255 - prime + 1 + (q % prime);
      }
      for (
        i = offset * 4;
        i < (offset + qS.length) * 4 && i < data.length;
        i += 4
      )
        data[i + 3] = qS[(i / 4) % threshold];

      subOffset = qS.length;
    }
    // Write message-delimiter
    subOffset = subOffset ?? 0;
    for (
      index = offset + subOffset;
      index - (offset + subOffset) < delimiter.length &&
      (offset + delimiter.length) * 4 < data.length;
      index += 1
    )
      data[index * 4 + 3] = delimiter[index - (offset + subOffset)];
    // Clear remaining data
    for (i = (index + 1) * 4 + 3; i < data.length; i += 4) data[i] = 255;
    for (i = 0; i < data.length; i++) imageData.data[i] = data[i];
    shadowCtx.putImageData(imageData, 0, 0);
  }
  return shadowCanvas.createPNGStream();
};
