const fs = require("fs").promises;
const f = require("./dirs");

module.exports = {
  node: (r) => {
    let file = `${f.getCurrentDirectoryPath}/vars/settings.json`;
    fs.readFile(file)
      .then((body) => JSON.parse(body))
      .then((json) => {
        json.serverNode.nodes = [];
        let n = {
          host: r.host,
          port: r.port,
          protocol: r.protocol,
        };
        json.serverNode.nodes.push(n);
        json.serverNode.apiKey = r.apiKey;
        return json;
      })
      .then((json) => JSON.stringify(json))
      .then((body) => fs.writeFile(file, body))
      .catch((error) => console.warn(error));
  },
};
