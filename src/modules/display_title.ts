const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");

module.exports = {
  title: () => {
    clear();
    console.log(
      chalk.red(figlet.textSync("TYPESENSE-CLI", { horizontalLayout: "full" }))
    );
  },
};
