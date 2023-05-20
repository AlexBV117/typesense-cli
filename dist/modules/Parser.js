"Use Strict";
import Version from "./Version";
import IndexDocuments from "./IndexDocuments";
import Schemas from "./Schemas";
import Help from "./Help";
import Key from "./Key";
import Server from "./Server";
import Collection from "./Collections";
export default class Parser {
    getTokens() {
        return this.tokens;
    }
    constructor(args) {
        this.tokens = [];
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
                },
            },
            server: {
                regex: /^(server)$/gm,
                function: (args) => {
                    return Server.parse(args);
                },
            },
            collections: {
                regex: /^(collections)$|^(c)$/gm,
                function: (args) => {
                    return Collection.parse(args);
                },
            },
            keys: {
                regex: /^(key)$|^(k)$/gm,
                function: (args) => {
                    return Key.parse(args);
                },
            },
            help: {
                regex: /^(help)$|^(h)$/gm,
                function: (args) => {
                    return Help.parse(args);
                },
            },
        };
        const argumentString = args.slice(2, args.length).join("|").trim();
        this.args = argumentString.split(/(?<![^\|\n])-{1,2}/gs).filter((elem) => {
            if (elem != "" && !elem.match(/^\|*$/)) {
                return elem;
            }
        });
        for (let i = 0; i < this.args.length; i++) {
            let _process = this.args[i].split("|").filter((elem) => elem);
            for (const command in this.commands) {
                if (_process[0].match(this.commands[command].regex)) {
                    const token = this.commands[command].function(_process.slice(1, _process.length));
                    if (token != null) {
                        this.tokens.push(token);
                    }
                }
            }
        }
    }
}
