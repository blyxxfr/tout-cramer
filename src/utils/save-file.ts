import { PNGStream } from "canvas";
import { createWriteStream } from "fs";

export const saveImage = (pngStream: PNGStream, path: string) =>
  new Promise<void>((resolve) => {
    const out = createWriteStream(path),
      stream = pngStream;

    stream.on("data", function (chunk) {
      out.write(chunk);
    });

    stream.on("end", function () {
      resolve();
    });
  });
