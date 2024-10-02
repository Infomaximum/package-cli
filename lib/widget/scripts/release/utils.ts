import detectIndent from "detect-indent";
import { detectNewline } from "detect-newline";

export const getJsonContentFile = (content: string) => {
  const json = JSON.parse(content);
  const indent = detectIndent(content).indent;
  const newline = detectNewline(content);

  return {
    json,
    indent,
    newline,
  };
};
