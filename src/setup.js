let fs = require("fs");

const x = {
  serverNode: {
    nodes: [{ host: "localhost", port: "9090", protocol: "http" }],
    apiKey: "alexander2baker3vallot5",
  },
  chunckSize: 10000,
  displayTitle: true,
};

const y = {
  automatic: {
    name: "automatic",
    fields: [
      { name: ".*", type: "auto" },
      { name: "title", type: "string", facet: true },
    ],
  },
};

let settings = JSON.stringify(x);
let schemas = JSON.stringify(y);

fs.mkdir(process.env.HOME + "/.typesense-cli", { recursive: true }, (err) => {
  if (err) throw err;
  console.log("Directory .typesense-cli created in the home directory");
});

fs.writeFile(
  process.env.HOME + "/.typesense-cli/typesense-cli.config.json",
  settings,
  (err) => {
    if (err) throw err;
    console.log(
      "typesense-cli.config.json successfully created in .typesense-cli"
    );
  }
);

fs.writeFile(
  process.env.HOME + "/.typesense-cli/schemas.json",
  schemas,
  (err) => {
    if (err) throw err;
    console.log("schemas.json successfully created in .typesense-cli");
  }
);

fs.chmod
