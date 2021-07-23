const EventEmitter = require("events");
const mod = require("./modules/serverManagement");
const arg = require("arg");

let App = new mod.application();

export function cli(args) {
  const x = arg({
    "--schemas": Boolean,
    "--help": Boolean,
    "--version": Boolean,
    "--node": Boolean,
    "--collections": Boolean,
    "--keys": Boolean,
    "--index": [String],
    "--newKey": [String],
    "--rmCollections": [String],
    "--rmKeys": [String],
  });
  if (x["--index"] || x["-i"]) {
    App.indexData(x["--index"]);
  }
}
