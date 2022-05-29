var chalk = require("chalk");
var clear = require("clear");
var figlet = require("figlet");
module.exports = {
    title: function () {
        clear();
        console.log(chalk.red(figlet.textSync("TYPESENSE-CLI", { horizontalLayout: "full" })));
    },
};
