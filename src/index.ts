const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const i = require("./modules/inquirer");
const m = require("./modules/varsManager");

clear();
console.log(
  chalk.red(figlet.textSync("TYPESENSE-CLI", { horizontalLayout: "full" }))
);

const run = async () => {
  console.log("Initalise a server node:");
  const node = await i.askInitQuestions();
  m.node(node);
};

run();
