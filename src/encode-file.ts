import * as fs from "fs";
import { encode } from "./lib/encode";
import { saveImage } from "./utils/save-file";

export const encodeFile = async (path: string) => {
  const buffer = fs.readFileSync(path);
  const fileContent = buffer.toString();
  const encodedStream = await encode(fileContent);
  await saveImage(encodedStream, `${path}.png`);
};
