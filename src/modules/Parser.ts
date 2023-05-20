"Use Strict";
/**
 * Import Function Classes Here
 */
import Version from "./Version";
import IndexDocuments from "./IndexDocuments";
import Schemas from "./Schemas";
import Help from "./Help";
import Key from "./Key";
import Server from "./Server";
import Collection from "./Collections";
// Parser Class that generates defined tokens for every passed flag from the command line.
export default class Parser {
  private tokens: Array<any> = [];
  public getTokens(): Array<any> {
    return this.tokens;
  }
  private args: string[];
  /**
   * An object containing all the functions for processing the command line arguments as tokens
   * as well as the regex for the identifying flag.
   */
  private commands = {
    index: {
      regex: /^(index)$|^(i)$/gm,
      function: (args: string[]) => {
        return IndexDocuments.parse(args);
      },
    },
    append: {
      regex: /^(append)$|^(a)$/gm,
      function: (args: string[]) => {
        return IndexDocuments.parse(args, true);
      },
    },
    schemas: {
      regex: /^(schemas)$|^(s)$/gm,
      function: (args: string[]) => {
        return Schemas.parse(args);
      },
    },
    version: {
      regex: /^(version)$|^(v)$/gm,
      function: (args: string[]) => {
        return Version.parse(args);
      },
    },
    server: {
      regex: /^(server)$/gm,
      function: (args: string[]) => {
        return Server.parse(args);
      },
    },
    collections: {
      regex: /^(collections)$|^(c)$/gm,
      function: (args: string[]) => {
        return Collection.parse(args);
      },
    },
    keys: {
      regex: /^(key)$|^(k)$/gm,
      function: (args: string[]) => {
        return Key.parse(args);
      },
    },
    help: {
      regex: /^(help)$|^(h)$/gm,
      function: (args: string[]) => {
        return Help.parse(args);
      },
    },
  };
  /**
   * Parser Constructor that takes the command line args and then generates the relevant tokens
   * @param args The command line arguments from the process
   */
  constructor(args: string[]) {
    // Isolate the user generated augments and concatenate them to a single string
    const argumentString: string = args.slice(2, args.length).join("|").trim();
    // Create an array of strings where each string contains the process and its associated data/parameters
    this.args = argumentString.split(/(?<![^\|\n])-{1,2}/gs).filter((elem) => {
      if (elem != "" && !elem.match(/^\|*$/)) {
        return elem;
      }
    });
    // Loop over the parameters
    for (let i = 0; i < this.args.length; i++) {
      let _process: string[] = this.args[i].split("|").filter((elem) => elem);
      for (const command in this.commands) {
        if (
          _process[0].match(
            this.commands[command as keyof typeof this.commands].regex
          )
        ) {
          const token = this.commands[
            command as keyof typeof this.commands
          ].function(_process.slice(1, _process.length));
          if (token != null) {
            this.tokens.push(token);
          }
        }
      }
    }
  }
}
