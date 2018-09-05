// tslint:disable:no-console
import {
  Beautifier,
  Language,
  BeautifierBeautifyData,
  DependencyType,
  NodeDependency,
} from "unibeautify";
import * as cosmiconfig from "cosmiconfig";
import * as readPkgUp from "read-pkg-up";
import options from "./options";

const { pkg } = readPkgUp.sync({ cwd: __dirname });
export const beautifier: Beautifier = {
  name: "CSScomb",
  package: pkg,
  dependencies: [
    {
      type: DependencyType.Node,
      name: "CSScomb",
      package: "csscomb",
    },
  ],
  options: {
    CSS: options.CSS,
    SCSS: options.CSS,
    Sass: options.CSS,
  },
  resolveConfig: ({ filePath, projectPath, dependencies }) => {
    const pathToSearch = filePath ? filePath : projectPath;
    if (!pathToSearch) {
      return Promise.resolve({});
    }
    const Comb = dependencies.get<NodeDependency>("CSScomb").package;
    const explorer = cosmiconfig("csscomb", {
      searchPlaces: [
        ".csscomb.json",
        "csscomb.json",
        ".csscomb.js",
        "csscomb.js",
      ],
    });
    return explorer
      .search(pathToSearch)
      .then(result => {
        if (!result) {
          return Promise.resolve({
            config: Comb.detectInFile(pathToSearch),
          });
        } else {
          return Promise.resolve({
            config: result.config,
          });
        }
      })
      .catch(error => {
        // tslint:disable-next-line:no-console
        console.log(error);
        return Promise.resolve({});
      });
  },
  beautify({
    text,
    options,
    filePath,
    projectPath,
    dependencies,
    beautifierConfig,
  }: BeautifierBeautifyData) {
    return new Promise<string>((resolve, reject) => {
      const CSScomb = dependencies.get<NodeDependency>("CSScomb").package;
      const config = (beautifierConfig && beautifierConfig.config) || {};
      const comb = new CSScomb(config);
      const result = comb.processString(text);
      if (result) {
        return resolve(result);
      } else {
        return resolve(text);
      }
    });
  },
};
export default beautifier;
