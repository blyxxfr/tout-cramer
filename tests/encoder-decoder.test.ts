import { encode } from "../src/lib/encode";
import { decode } from "../src/lib/decode";
import { saveImage } from "../src/utils/save-file";
import * as path from "path";
import * as fs from "fs";
import { runImage } from "../src/run-image";

const text = "console.log('hello there');";
const imagePath = path.join(__dirname, "test.png");

beforeEach(async () => {
  await new Promise((r) => setTimeout(r, 1000));
});

test("Should encode image", async () => {
  const encodedStream = await encode(text);
  await saveImage(encodedStream, imagePath);
  expect(fs.existsSync(imagePath)).toEqual(true);
});

test("Should decode the said image", async () => {
  const decodedImage = await decode(imagePath);
  expect(decodedImage).toEqual(text);
});

test("Should run image", async () => {
  await runImage(imagePath);
});
