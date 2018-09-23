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
  const beautifierResult = `
  .test {
    content: '';

    position: absolute;
    top: 0;
  }
  `;
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
test(`should not beautify because we are not passing in file path`, () => {
  const unibeautify = newUnibeautify();
  unibeautify.loadBeautifier(beautifier);
  const text = `.test {content: '';}`;
  const beautifierResult = `.test {\ncontent: '';\n}`;
  return unibeautify
    .beautify({
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
test(`should not beautify because file path does not find a config`, () => {
  const unibeautify = newUnibeautify();
  unibeautify.loadBeautifier(beautifier);
  const text = `.test {content: '';}`;
  const beautifierResult = `.test {\ncontent: '';\n}`;
  return unibeautify
    .beautify({
      filePath: errorFilePath,
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
