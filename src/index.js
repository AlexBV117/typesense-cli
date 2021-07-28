const i = require("./modules/indexData");
const a = require("./modules/other");
const inq = require("./modules/changeNodeSettings");
const vars = require("./modules/updateSettings");
const d = require("./modules/dirs");
const arg = require("arg");
const index = new i.application();
const other = new a.application();
export async function cli(args) {
  const x = arg({
    "--schemas": Boolean,
    "--help": Boolean,
    "--version": Boolean,
    "--serverNode": Boolean,
    "--collections": Boolean,
    "--key": Boolean,
    "--index": String,
    "--new": String,
    "--remove": String,
    "-v": "--version",
    "-i": "--index",
    "-h": "--help",
    "-s": "--schemas",
    "-c": "--collections",
    "-k": "--key",
    "-r": "--remove",
    "-n": "--new",
  });
  if (x["--index"]) {
    let y = `[${x["--index"]}]`;
    index.indexData(y);
  }
  if (x["--schemas"]) {
    other.getSchemas();
  }
  if (x["--version"]) {
    other.version();
  }
  if (x["--serverNode"]) {
    let r = await inq.nodeSettings();
    vars.node(r);
  }
  if (x["--help"]) {
    other.help();
  }
  if (x["--key"] && !x["--remove"] && !x["--new"]) {
    other.getKeys();
  }
  if (x["--key"] && x["--remove"]) {
    other.removeKey(x["--remove"]);
  }
  if (x["--key"] && x["--new"]) {
    other.makeKey(x["--new"]);
  }
  if (x["--collections"] && !x["--remove"] && !x["--new"]) {
    other.collections();
  }
  if (x["--collections"] && x["--remove"]) {
    other.deleteCollection(x["--remove"]);
  }
}
