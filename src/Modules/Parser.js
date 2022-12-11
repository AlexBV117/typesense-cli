"use strict";
"Use Strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parser {
    /**
     *
     * @param args The command line arguments from the porcess
     */
    constructor(args) {
        this.tokens = [];
        this.commands = {
            index: {
                regex: /^(index)$|^(i)$/gm,
                function: function (peram, parser) {
                    const filePathRegex = /(?:(?:\/|\.\/|\.\.\/)[^\/\\]+)+(?:\.json)/gm;
                    const ObjArrayRegex = /\[(?:{.*})+\]/gm;
                    try {
                        let token = {
                            name: "index",
                            data: {
                                append: false,
                                collection: "",
                                data_files: [],
                                data_raw: []
                            }
                        };
                        for (let i = peram.length; i > 0; i--) {
                            if (peram[i].match(filePathRegex)) {
                                token.data.data_files.push(peram[i]);
                            }
                            else if (peram[i].match(ObjArrayRegex)) {
                                token.data.data_raw.push(peram[i]);
                            }
                            else {
                                throw `Type Error: ${peram[i]} invalid data reference
                            Expected valid path to json or json object array.`;
                            }
                        }
                        return token;
                    }
                    catch (error) {
                        console.error(error);
                        return null;
                    }
                }
            },
            append: {
                regex: /^(append)$|^(a)$/gm,
                function: function (peram, parser) {
                    const filePathRegex = /(?:(?:\/|\.\/|\.\.\/)[^\/\\]+)+(?:\.json)/gm;
                    const ObjArrayRegex = /\[(?:{.*})+\]/gm;
                    try {
                        let token = {
                            name: "index",
                            data: {
                                append: true,
                                collection: "",
                                data_files: [],
                                data_raw: []
                            }
                        };
                        for (let i = peram.length; i > 0; i--) {
                            if (peram[i].match(filePathRegex)) {
                                token.data.data_files.push(peram[i]);
                            }
                            else if (peram[i].match(ObjArrayRegex)) {
                                token.data.data_raw.push(peram[i]);
                            }
                            else {
                                throw `Type Error: ${peram[i]} invalid data reference
                            Expected valid path to json or json object array.`;
                            }
                        }
                        return token;
                    }
                    catch (error) {
                        console.error(error);
                        return null;
                    }
                }
            },
            schemas: {
                regex: /^(schemas)$|^(s)$/gm,
                function: function (peram, parser) {
                    try {
                        let token = {
                            name: "schemas",
                            data: {},
                        };
                        return token;
                    }
                    catch (error) {
                        console.error(error);
                        return null;
                    }
                }
            },
            version: {
                regex: /^(version)$|^(v)$/gm,
                function: function (peram, parser) {
                    try {
                        let token = {
                            name: "version",
                            data: {}
                        };
                        return token;
                    }
                    catch (error) {
                        console.error(error);
                        return null;
                    }
                }
            },
            server: {
                regex: /^(server)$/gm,
                function: function (peram, parser) {
                    try {
                        let token = {
                            name: "server",
                            data: {}
                        };
                        return token;
                    }
                    catch (error) {
                        console.error(error);
                        return null;
                    }
                }
            },
            collections: {
                regex: /^(collections)$|^(c)$/gm,
                function: function (peram, parser) {
                    try {
                        let token = {
                            name: "collection",
                            data: {
                                name: [],
                                new: false,
                                remove: false
                            },
                        };
                        return token;
                    }
                    catch (error) {
                        console.error(error);
                        return null;
                    }
                }
            },
            keys: {
                regex: /^(key)$|^(k)$/gm,
                function: function (peram, parser) {
                    try {
                        let token = {
                            name: "key",
                            data: {
                                actions: [],
                                collections: [],
                                description: "",
                                value: "",
                                expiresAt: "",
                                id: 0,
                                new: false,
                                remove: false
                            }
                        };
                        return token;
                    }
                    catch (error) {
                        console.error(error);
                        return null;
                    }
                }
            },
            help: {
                regex: /^(help)$|^(h)$/gm,
                function: function (peram, parser) {
                    try {
                        let token = {
                            name: "help",
                            data: {
                                path: "@Config/help.txt"
                            }
                        };
                        return token;
                    }
                    catch (error) {
                        console.error(error);
                        return null;
                    }
                }
            }
        };
        // Isolate the user generated aguments and concatonate them to a single string
        let argumetString = args.slice(2, args.length).join("|").trim();
        // Create an array of strings where each string contains the process and its associated data/perameters
        this.args = argumetString.split(/-{1,2}/).filter(elem => {
            if (elem != "" && !elem.match(/^\|*$/)) {
                return elem;
            }
        });
        // Loop over the perameters
        for (let i = 0; i < this.args.length; i++) {
            let _process = this.args[i].split("|").filter(elem => elem);
            for (let command in this.commands) {
                if (_process[0].match(this.commands[command].regex)) {
                    let token = this.commands[command].function(_process.slice(1, _process.length), this);
                    if (token != null) {
                        this.tokens.push(token);
                    }
                }
                ;
            }
        }
        ;
        console.log(this.tokens[0]);
    }
    createMap(kvp) {
        const kvpRegex = /[^=]*=[^=]*/gm;
        if (kvp.match(kvpRegex)) {
            let result_array = kvp.split('=').filter(elem => elem).slice(0, 2);
            return result_array;
        }
        else {
            return null;
        }
    }
}
exports.default = Parser;
