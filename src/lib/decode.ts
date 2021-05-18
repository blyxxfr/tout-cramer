import { config } from "../config";
import { findNextPrime } from "../utils/next-prime";
import { createCanvas, loadImage } from "canvas";

export const decode = async (imagePath: string) => {
  // Handle image url
  const image = await loadImage(imagePath);

  const t = config.t,
    threshold = config.threshold,
    codeUnitSize = config.codeUnitSize,
    prime = findNextPrime(Math.pow(2, t)),
    messageCompleted = config.messageCompleted;

  if (!t || t < 1 || t > 7)
    throw new Error(
      'IllegalOptions: Parameter t = " + t + " is not valid: 0 < t < 8'
    );

  const shadowCanvas = createCanvas(image.width, image.height),
    shadowCtx = shadowCanvas.getContext("2d");

  if (shadowCtx) {
    shadowCtx.drawImage(image, 0, 0);

    let imageData = shadowCtx.getImageData(
        0,
        0,
        shadowCanvas.width,
        shadowCanvas.height
      ),
      data = imageData.data,
      modMessage = [];

    let i, done;
    if (threshold === 1) {
      for (i = 3, done = false; !done && i < data.length && !done; i += 4) {
        done = messageCompleted(data, i);
        if (!done) modMessage.push(data[i] - (255 - prime + 1));
      }
    }

    let message = "",
      charCode = 0,
      bitCount = 0,
      mask = Math.pow(2, codeUnitSize) - 1;
    for (i = 0; i < modMessage.length; i += 1) {
      charCode += modMessage[i] << bitCount;
      bitCount += t;
      if (bitCount >= codeUnitSize) {
        message += String.fromCharCode(charCode & mask);
        bitCount %= codeUnitSize;
        charCode = modMessage[i] >> (t - bitCount);
      }
    }
    if (charCode !== 0) message += String.fromCharCode(charCode & mask);

    return message;
  }
  return "";
};
