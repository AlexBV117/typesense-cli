const fs = require("fs");
const path = require("path");

module.exports = {
  getCurrentDirectoryPath: () => {
    return `${path.dirname(process.cwd())}/${path.basename(process.cwd())}`;
  },
  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  },
  getDirectoryPath: () => {
    console.log(path.parse(process.cwd()));
    // process.chdir("home");
  },
};
