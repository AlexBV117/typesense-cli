const inquirer = require("inquirer");

const title = require("./display_title");

module.exports = {
  nodeSettings: () => {
    title.title();
    const questions = [
      {
        name: "host",
        type: "input",
        message: "Host (default => localhost): ",
        default: "localhost",
      },
      {
        name: "port",
        type: "input",
        message: "API port (default =>  8108):",
        default: "8108",
      },
      {
        name: "protocol",
        type: "input",
        message: "Protocol (default => http):",
        default: "http",
      },
      {
        name: "apiKey",
        type: "input",
        message: "API key (key type must be admin)",
        validate: (value) => {
          if (value.length) {
            return true;
          } else return "Please Provide an API Key of Type (admin)!!!";
        },
      },
    ];
    return inquirer.prompt(questions);
  },
};
