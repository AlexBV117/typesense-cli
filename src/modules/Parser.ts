"Use Strict";
/**
 * Import Function Classes Here
 */
import Index from "./Index";
import Collection from "./Collections";
import Key from "./Key";
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
  private modules = [
    {
      regex: /^(index)$|^(i)$/gm,
      function: (args: string[]) => {
        return Index.parse(args);
      },
    },
    {
      regex: /^(collections)$|^(c)$/gm,
      function: (args: string[]) => {
        return Collection.parse(args);
      },
    },
    {
      regex: /^(key)$|^(k)$/gm,
      function: (args: string[]) => {
        return Key.parse(args);
      },
    },
  ];
  /**
   * Parser Constructor that takes the command line args and then generates the relevant tokens
   * @param args The command line arguments from the process
   */
  constructor(args: string[]) {
    // Isolate the user generated augments and concatenate them to a single string
    const argumentString: string = args.slice(2, args.length).join("|").trim();
    // Create an array of strings where each string contains the process and its associated data/parameters
    this.args = argumentString.split(/(?<![^\|\n])-{2}/gs).filter((elem) => {
      if (elem != "" && !elem.match(/^\|*$/)) {
        return elem;
      }
    });
    // Loop over the parameters
    for (let i = 0; i < this.args.length; i++) {
      let _process: string[] = this.args[i].split("|").filter((elem) => {
        if (elem == "") return;
        else return elem.trim();
      });
      console.log(_process);
      for (const module in this.modules) {
        if (_process[0].match(this.modules[module].regex)) {
          const token = this.modules[module].function(_process.slice(1));
          if (token != null) {
            this.tokens.push(token);
          }
        }
      }
    }
  }
}
