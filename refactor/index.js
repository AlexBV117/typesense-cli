const i = require("./modules/cmdFunctions");
const inq = require("./modules/inquire");
const update = require("./modules/updateSettings");
const arg = require("arg");
const index = new i.index();
const other = new i.other();
export async function cli(args) {
  const x = arg({
    "--schemas": Boolean,
    "--help": Boolean,
    "--version": Boolean,
    "--server": Boolean,
    "--collections": Boolean,
    "--key": Boolean,
    "--index": String,
    "--new": String,
    "--remove": String,
    "--append": String,
    "-v": "--version",
    "-i": "--index",
    "-h": "--help",
    "-s": "--schemas",
    "-c": "--collections",
    "-k": "--key",
    "-r": "--remove",
    "-n": "--new",
    "-a": "--append"
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
  if (x["--server"]) {
    let r = await inq.nodeSettings();
    update.node(r);
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
  if (x["--append"]){
    let y = `[${x["--append"]}]`;
    index.appendData(y)
  }
}
