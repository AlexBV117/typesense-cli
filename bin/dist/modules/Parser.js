"Use Strict";
import Index from "./Index";
import Collection from "./Collections";
import Key from "./Key";
export default class Parser {
    getTokens() {
        return this.tokens;
    }
    constructor(args) {
        this.tokens = [];
        this.modules = [
            {
                regex: /^(index)$|^(i)$/gm,
                function: (args) => {
                    return Index.parse(args);
                },
            },
            {
                regex: /^(collections)$|^(c)$/gm,
                function: (args) => {
                    return Collection.parse(args);
                },
            },
            {
                regex: /^(key)$|^(k)$/gm,
                function: (args) => {
                    return Key.parse(args);
                },
            },
        ];
        const argumentString = args.slice(2, args.length).join("|").trim();
        this.args = argumentString.split(/(?<![^\|\n])-{2}/gs).filter((elem) => {
            if (elem != "" && !elem.match(/^\|*$/)) {
                return elem;
            }
        });
        for (let i = 0; i < this.args.length; i++) {
            let _process = this.args[i].split("|").filter((elem) => {
                if (elem == "")
                    return;
                else
                    return elem.trim();
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
