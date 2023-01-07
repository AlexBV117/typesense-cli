"Use Strict";
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
                function: function (param, parser, _token) {
                    const filePathRegex = /(?:(?:\/|\.\/|\.\.\/)[^\/\\]+)+(?:\.json)/gm;
                    const ObjRegex = /{.*}/gm;
                    const ArrayRegex = /\[[^\[\]]*,?\]/gm;
                    try {
                        let token;
                        if (typeof _token === 'undefined') {
                            token = {
                                name: "index",
                                data: {
                                    append: false,
                                    collection: "",
                                    data_files: [],
                                    data_raw: []
                                }
                            };
                        }
                        else {
                            /**
                             *  So that there is not duplicate code for the append and index
                             *  functions this assigns the append token to be returned by the index function.
                             */
                            token = _token;
                        }
                        // The first argument for the index flag is the collection.
                        token.data.collection = param[0];
                        // Iterate over the remaining args.
                        for (let i = (param.length - 1); i > 0; i--) {
                            if (param[i].match(filePathRegex)) { // Add the file paths to the paths array.
                                token.data.data_files.push(param[i]);
                            }
                            else if (param[i].match(ObjRegex)) { // Add raw json objects to the data array.
                                if (param[i].match(ArrayRegex)) {
                                    // This takes any array passed as a string to be appended to the raw data array (allows for rested json objects)
                                    let tmp = param[i].replace(/}[\s]?,[\s]?{/gm, "}<comma>{").replace(/\"\[|\]\"/g, '');
                                    token.data.data_raw = token.data.data_raw.concat(tmp.split("<comma>"));
                                }
                                else {
                                    // If a single object is passed then just append it to the raw data array
                                    token.data.data_raw.push(param[i]);
                                }
                            }
                            else {
                                // Throw an error if an argument doesn't match the two supported data types.
                                throw `Data Reference Error: ${param[i]} is an invalid argument. Expected a valid file path or a JSON object(s).`;
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
                function: function (param, parser) {
                    let token = {
                        name: "index",
                        data: {
                            append: true,
                            collection: "",
                            data_files: [],
                            data_raw: []
                        }
                    };
                    /**
                     * The append function contains basically the same logic
                     * so just passing the token to the index function avoids duplication.
                     */
                    return parser.commands.index.function(param, parser, token);
                }
            },
            schemas: {
                regex: /^(schemas)$|^(s)$/gm,
                function: function (param, parser) {
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
                function: function (param, parser) {
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
                function: function (param, parser) {
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
                function: function (param, parser) {
                    try {
                        let token = {
                            name: "collection",
                            data: {
                                name: [],
                                new: false,
                                remove: false
                            },
                        };
                        if (param.includes("new")) {
                            token.data.new = true;
                            let index = param.lastIndexOf("new");
                            param.splice(index, 1);
                        }
                        if (param.includes("remove")) {
                            token.data.remove = true;
                            let index = param.lastIndexOf("remove");
                            param.splice(index, 1);
                        }
                        if (token.data.new && token.data.remove) {
                            throw "Inconsistency Error: Both \"new\" and \"remove\" keywords have been passed";
                        }
                        token.data.name = token.data.name.concat(param);
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
                function: function (param, parser) {
                    try {
                        let token = {
                            name: "key",
                            data: {
                                actions: [],
                                collections: [],
                                description: "",
                                value: "",
                                expiresAt: "",
                                id: -1,
                                new: false,
                                remove: false
                            }
                        };
                        // Detect and remove the "new" and "remove" key words
                        if (param.includes("new")) {
                            token.data.new = true;
                            let index = param.lastIndexOf("new");
                            param.splice(index, 1);
                        }
                        if (param.includes("remove")) {
                            token.data.remove = true;
                            let index = param.lastIndexOf("remove");
                            param.splice(index, 1);
                        }
                        // Obviously a conflict so throw dat error
                        if (token.data.new === true && token.data.remove === true) {
                            throw "Inconsistency Error: Both \"new\" and \"remove\" keywords have been passed";
                        }
                        for (let i = param.length - 1; i >= 0; i--) {
                            let kvp = parser.generateKVP(param[i]); // Create a key value pair for the args passed
                            if (kvp !== null) {
                                switch (kvp[0]) {
                                    case "actions": {
                                        token.data.actions = token.data.actions.concat(kvp[1].replace(/\"\[|\]\"/g, '').replace(/\s/gm, "").split(','));
                                        break;
                                    }
                                    case "collections": {
                                        token.data.collections = token.data.collections.concat(kvp[1].replace(/\"\[|\]\"/g, '').replace(/\s/gm, "").split(','));
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
                                        }
                                        else
                                            token.data.id = Number(kvp[1].replace(/['"`]/gm, ""));
                                        break;
                                    }
                                    default: {
                                        throw `Undefined Argument Error: \"${kvp}\" is not a supported value for key data`;
                                    }
                                }
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
            help: {
                regex: /^(help)$|^(h)$/gm,
                function: function (param, parser) {
                    try {
                        let token = {
                            name: "help",
                            data: {
                                path: ""
                            }
                        };
                        const tmp = __dirname.match(/^(\/.*\/typesense-cli)/gm);
                        if (tmp !== null) {
                            let path = tmp[0];
                            token.data.path = path + "/config/help.txt";
                        }
                        else {
                            throw "Unresolved Path Error: unable to generate the path to the help.txt file";
                        }
                        return token;
                    }
                    catch (error) {
                        console.error(error);
                        return null;
                    }
                }
            }
        };
        // Isolate the user generated augments and concatenate them to a single string
        let argumentString = args.slice(2, args.length).join("|").trim();
        // Create an array of strings where each string contains the process and its associated data/parameters
        this.args = argumentString.split(/(?<![^\|\n])-{1,2}/gs).filter(elem => {
            if (elem != "" && !elem.match(/^\|*$/)) {
                return elem;
            }
        });
        // Loop over the parameters
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
    getTokens() {
        return this.tokens;
    }
    ;
    /**
     * Generates an array of length 2 from a string that maps a know word to a set of data
     * @param kvp String that needs to be split into a kvp
     * @returns Null if the sting doesn't match the regex or an array where the first item is the key and the second item is the value
     */
    generateKVP(kvp) {
        const kvpRegex = /[^=]*=[^=]*/gm;
        if (typeof kvp.match(kvpRegex) !== null) {
            let result_array = kvp.split('=').filter(elem => elem).slice(0, 2);
            if (result_array.length != 2) {
                return null;
            }
            else
                return result_array;
        }
        else {
            return null;
        }
    }
}
