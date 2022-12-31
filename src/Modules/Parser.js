"Use Strict";
export default class Parser {
    /**
     *
     * @param args The command line arguments from the porcess
     */
    constructor(args) {
        this.tokens = [];
        /**
         * An object containg all the functions for processing the command line arguments as tokens
         */
        this.commands = {
            index: {
                regex: /^(index)$|^(i)$/gm,
                function: function (peram, parser) {
                    const filePathRegex = /(?:(?:\/|\.\/|\.\.\/)[^\/\\]+)+(?:\.json)/gm;
                    const ObjRegex = /({[^{]*})/gm;
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
                        token.data.collection = peram[0];
                        for (let i = (peram.length - 1); i > 0; i--) {
                            if (peram[i].match(filePathRegex)) {
                                token.data.data_files.push(peram[i]);
                            }
                            else if (peram[i].match(ObjRegex)) {
                                let tmp = peram[i].match(ObjRegex);
                                if (tmp != null) {
                                    token.data.data_raw = token.data.data_raw.concat(tmp);
                                }
                            }
                            else {
                                throw `Type Error: ${peram[i]} invalid data reference. Expected a valid file path or an array of JSON objects.`;
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
                    const ObjRegex = /({[^{]*})/gm;
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
                        token.data.collection = peram[0];
                        for (let i = (peram.length - 1); i > 0; i--) {
                            if (peram[i].match(filePathRegex)) {
                                token.data.data_files.push(peram[i]);
                            }
                            else if (peram[i].match(ObjRegex)) {
                                let tmp = peram[i].match(ObjRegex);
                                if (tmp != null) {
                                    token.data.data_raw = token.data.data_raw.concat(tmp);
                                }
                            }
                            else {
                                throw `Type Error: ${peram[i]} invalid data reference. Expected a valid file path or an array of JSON objects.`;
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
                        if (peram.includes("new")) {
                            token.data.new = true;
                            let index = peram.lastIndexOf("new");
                            peram.splice(index, 1);
                        }
                        if (peram.includes("remove")) {
                            token.data.remove = true;
                            let index = peram.lastIndexOf("remove");
                            peram.splice(index, 1);
                        }
                        if (token.data.new && token.data.remove) {
                            throw "Inconsistency Error: Both \"new\" and \"remove\" keywords have been passed";
                        }
                        token.data.name.concat(peram);
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
                        if (peram.includes("new")) {
                            token.data.new = true;
                            let index = peram.lastIndexOf("new");
                            peram.splice(index, 1);
                        }
                        if (peram.includes("remove")) {
                            token.data.remove = true;
                            let index = peram.lastIndexOf("remove");
                            peram.splice(index, 1);
                        }
                        if (token.data.new && token.data.remove) {
                            throw "Inconsistency Error: Both \"new\" and \"remove\" keywords have been passed";
                        }
                        for (let i = peram.length; i > 0; i--) {
                        }
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
        this.args = argumetString.split(/(?<![^\|\n])-{1,2}/gs).filter(elem => {
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
    }
    getTokens() {
        return this.tokens;
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
