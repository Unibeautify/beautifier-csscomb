import { newUnibeautify, Beautifier } from "unibeautify";
import beautifier from "../../src";
import * as path from "path";
const filePath: string = path.resolve(__dirname, "test.css");
const errorFilePath: string = path.resolve("nothing");
test(`should successfully beautify CSS text with given sort-order`, () => {
  const unibeautify = newUnibeautify();
  unibeautify.loadBeautifier(beautifier);
  const text = `
  .test {
    top: 0;
    content: '';
    position: absolute;
  }
  `;
  // tslint:disable:no-trailing-whitespace
  const beautifierResult = `
  .test {
    content: '';

    position: absolute;
    top: 0;
  }
  `;
  // tslint:enable:no-trailing-whitespace
  return unibeautify
    .beautify({
      filePath,
      languageName: "CSS",
      options: {
        CSS: {
          CSScomb: {
            prefer_beautifier_config: true,
          },
        } as any,
      },
      text,
    })
    .then(results => {
      expect(results).toBe(beautifierResult);
    });
});
