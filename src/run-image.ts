import { decode } from "./lib/decode";

const stripBOM = (content: string) => {
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }
  return content;
};

export const runImage = async (path: string) => {
  const decodedImage = await decode(path);
  const content = stripBOM(decodedImage);
  eval(content);
};
