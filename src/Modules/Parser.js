"Use Strict";
/**
 * Import Function Classes Here
 */
import Version from './Version';
import IndexDocuments from './IndexDocuments';
import Schemas from './Schemas';
import Help from './Help';
import Key from './Key';
import Server from './Server';
import Collection from './Collections';
// Parser Class that generates defined tokens for every passed flag from the command line.
export default class Parser {
    /**
     * Parser Constructor that takes the command line args and then generates the relevant tokens
     * @param args The command line arguments from the process
     */
    constructor(args) {
        this.tokens = [];
        /**
         * An object containing all the functions for processing the command line arguments as tokens
         * as well as the regex for the identifying flag.
         */
        this.commands = {
            index: {
                regex: /^(index)$|^(i)$/gm,
                function: (args) => {
                    return IndexDocuments.parse(args);
                },
            },
            append: {
                regex: /^(append)$|^(a)$/gm,
                function: (args) => {
                    return IndexDocuments.parse(args, true);
                },
            },
            schemas: {
                regex: /^(schemas)$|^(s)$/gm,
                function: (args) => {
                    return Schemas.parse(args);
                },
            },
            version: {
                regex: /^(version)$|^(v)$/gm,
                function: (args) => {
                    return Version.parse(args);
                }
            },
            server: {
                regex: /^(server)$/gm,
                function: (args) => {
                    return Server.parse(args);
                }
            },
            collections: {
                regex: /^(collections)$|^(c)$/gm,
                function: (args) => {
                    return Collection.parse(args);
                }
            },
            keys: {
                regex: /^(key)$|^(k)$/gm,
                function: (args) => {
                    return Key.parse(args);
                }
            },
            help: {
                regex: /^(help)$|^(h)$/gm,
                function: (args) => {
                    return Help.parse(args);
                },
            }
        };
        // Isolate the user generated augments and concatenate them to a single string
        const argumentString = args.slice(2, args.length).join("|").trim();
        // Create an array of strings where each string contains the process and its associated data/parameters
        this.args = argumentString.split(/(?<![^\|\n])-{1,2}/gs).filter(elem => {
            if (elem != "" && !elem.match(/^\|*$/)) {
                return elem;
            }
        });
        // Loop over the parameters
        for (let i = 0; i < this.args.length; i++) {
            const _process = this.args[i].split("|").filter(elem => elem);
            for (const command in this.commands) {
                if (_process[0].match(this.commands[command].regex)) {
                    const token = this.commands[command].function(_process.slice(1, _process.length));
                    if (token != null) {
                        this.tokens.push(token);
                    }
                }
                ;
            }
        }
        ;
    }
    getTokens() {
        return this.tokens;
    }
    ;
    ;
}
