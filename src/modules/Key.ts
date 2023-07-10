import Keys_Token from "../interfaces/Keys";
import RunTime from "../RunTime";

export default class Key {
  constructor(token: Keys_Token, setting: RunTime) {}
  public static parse(args: string[]) {
    try {
      const token: Keys_Token = {
        constructor: Key.prototype.constructor,
        data: {
          actions: [],
          collections: [],
          description: "",
          value: "",
          expiresAt: "",
          id: -1,
          new: false,
          remove: false,
        },
      };
      // Detect and remove the "new" and "remove" key words
      if (args.includes("new")) {
        token.data.new = true;
        const index = args.lastIndexOf("new");
        args.splice(index, 1);
      }
      if (args.includes("remove")) {
        token.data.remove = true;
        const index = args.lastIndexOf("remove");
        args.splice(index, 1);
      }
      // Obviously a conflict so throw dat error
      if (token.data.new === true && token.data.remove === true) {
        throw 'Inconsistency Error: Both "new" and "remove" keywords have been passed';
      }
      for (let i = args.length - 1; i >= 0; i--) {
        const kvp = ["", ""]; // Create a key value pair for the args passed
        if (kvp !== null) {
          switch (kvp[0]) {
            case "actions": {
              token.data.actions = token.data.actions.concat(
                kvp[1]
                  .replace(/\"\[|\]\"/g, "")
                  .replace(/\s/gm, "")
                  .split(",")
              );
              break;
            }
            case "collections": {
              token.data.collections = token.data.collections.concat(
                kvp[1]
                  .replace(/\"\[|\]\"/g, "")
                  .replace(/\s/gm, "")
                  .split(",")
              );
              break;
            }
            case "description": {
              token.data.description = kvp[1].replace(/['"`]/gm, "");
              break;
            }
            case "value": {
              token.data.value = kvp[1].replace(/['"`]/gm, "");
              break;
            }
            case "expiresAt": {
              token.data.expiresAt = kvp[1].replace(/['"`]/gm, "");
              break;
            }
            case "id": {
              const num = Number(kvp[1].replace(/['"`]/gm, ""));
              if (isNaN(num)) {
                throw "Type Error: id provided is not a valid number";
              } else token.data.id = Number(kvp[1].replace(/['"`]/gm, ""));
              break;
            }
            default: {
              throw `Undefined Argument Error: \"${kvp}\" is not a supported value for key data`;
            }
          }
        }
      }
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
