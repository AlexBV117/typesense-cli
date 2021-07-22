const fs = require("fs").promises;

module.exports = {
  node: (r) => {
    let file = "/home/alexander/Documents/typesense-cli/vars/serverNode.json";
    fs.readFile(file)
      .then((body) => JSON.parse(body))
      .then((json) => {
        json.nodes = [];
        let n = {
          host: r.host,
          port: r.port,
          protocol: r.protocol,
        };
        json.nodes.push(n);
        json.apiKey = r.apiKey;
        return json;
      })
      .then((json) => JSON.stringify(json))
      .then((body) => fs.writeFile(file, body))
      .catch((error) => console.warn(error));
  },
};
