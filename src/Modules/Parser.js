"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tokenizer {
    /**
     * Tokenizer Constructor Function
     * @param args Array of Strings containing the environment variables
     */
    constructor(args) {
        this.index = 0;
        this.isFlagRegex = /-{1,2}[a-zA-Z]+/gm;
        this.processedArgs = {
            help: false,
            index: {
                index: false,
                append: false,
                collections: [],
                data: []
            },
            schemas: false,
            version: false,
            server: false,
            collections: {
                get: false,
                remove: false,
                name: []
            },
            keys: {
                new: false,
                remove: false,
                actions: [],
                collections: [],
                description: "",
                value: "",
                expiresAt: "",
                id: 0
            },
        };
        this.commands = {
            index: {
                regex: /^(--index)$|^(-i)$/gm,
                function: function (that) {
                    that.processedArgs.index.index = true;
                    for (; that.index < that.args.length; that.index++) {
                        let currentArgument = that.args[that.index];
                        if (currentArgument.match(that.isFlagRegex)) {
                            that.processFlag(currentArgument);
                        }
                        else {
                            let currentArgumentArray = that.createKeyValuePair(currentArgument);
                            if (currentArgumentArray == null) {
                                continue;
                            }
                            ;
                            that.processedArgs.index.collections.push(currentArgumentArray[0]);
                            let currentArgumentData = currentArgumentArray[1].split(',');
                            that.processedArgs.index.data.push(currentArgumentData);
                        }
                        ;
                    }
                }
            },
            append: {
                regex: /^(--append)$|^(-a)$/gm,
                function: function (that) {
                    that.processedArgs.index.append = true;
                    that.commands.index.function(that);
                }
            },
            schemas: {
                regex: /^(--schemas)$|^(-s)$/gm,
                function: function (that) {
                    that.processedArgs.schemas = true;
                }
            },
            help: {
                regex: /^(--help)$|^(-h)$/gm,
                function: function (that) {
                    that.processedArgs.help = true;
                }
            },
            version: {
                regex: /^(--version)$|^(-v)$/gm,
                function: function (that) {
                    that.processedArgs.version = true;
                }
            },
            server: {
                regex: /^(--server)$/gm,
                function: function (that) {
                    that.processedArgs.server = true;
                }
            },
            collections: {
                regex: /^(--collections)$|^(-c)$/gm,
                function: function (that) {
                    for (; that.index < that.args.length; that.index++) {
                        let currentArgument = that.args[that.index];
                        if (currentArgument.match(that.isFlagRegex)) {
                            that.processFlag(currentArgument);
                        }
                        else {
                            that.processedArgs.collections.name.push(currentArgument);
                        }
                    }
                    if (that.processedArgs.collections.remove == false) {
                        that.processedArgs.collections.get == true;
                    }
                    else {
                        that.processedArgs.collections.get == false;
                    }
                }
            },
            key: {
                regex: /^(--key)$|^(-k)$/gm,
                function: function (that) {
                    for (; that.index < that.args.length; that.index++) {
                        let currentArgument = that.args[that.index];
                        if (currentArgument.match(that.isFlagRegex)) {
                            that.processFlag(currentArgument);
                        }
                        else {
                            let currentArgumentArray = that.createKeyValuePair(currentArgument);
                            if (currentArgumentArray == null) {
                                continue;
                            }
                            ;
                            switch (currentArgumentArray[0]) {
                                case "actions":
                                    that.processedArgs.keys.actions.push(currentArgumentArray[1]);
                                    break;
                                case "collections":
                                    that.processedArgs.keys.collections.push(currentArgumentArray[1]);
                                    break;
                                case "description":
                                    that.processedArgs.keys.description = currentArgumentArray[1];
                                    break;
                                case "value":
                                    that.processedArgs.keys.expiresAt = currentArgumentArray[1];
                                    break;
                                case "id":
                                    that.processedArgs.keys.id = Number.parseInt(currentArgumentArray[1].toString());
                                    break;
                                case "value":
                                    that.processedArgs.keys.value = currentArgumentArray[1];
                                    break;
                            }
                        }
                    }
                }
            },
            new: {
                regex: /^(--new)$|^(-n)$/gm,
                function: function (that, caller) {
                    caller.new = true;
                }
            },
            remove: {
                regex: /^(--remove)$|^(-r)$/gm,
                function: function (that, caller) {
                    caller.remove = true;
                }
            },
        };
        this.args = args.splice(2, args.length); // reduces the array down to the user passed environment variables 
        for (this.index = 0; this.index < this.args.length; this.index++) {
            if (this.args[this.index].match(this.isFlagRegex)) {
                this.processFlag(this.args[this.index]); // if an input flag is found it is then processed
            }
        }
        console.log(this.processedArgs);
    }
    /**
     * Compares the flag to the operations defined in the commands object
     * then executes the accompanying function
     */
    processFlag(currentArgument) {
        for (let command in this.commands) {
            if (currentArgument.match(this.commands[command].regex)) {
                this.index++;
                this.commands[command].function(this);
            }
            ;
        }
    }
    /**
     * Takes in a key value pair (KVP) in the form of a string and returns it as an array
     * key value pair separators accepted are ':'.
     * @param keyValuePairString string form of a key value pair
     * @returns KVP as an array or null if not a key value pair
     */
    createKeyValuePair(keyValuePairString) {
        let ErrorMessage = `Key Value Pair Error: ${keyValuePairString} not of recognized form *KEY*:*VALUE*`;
        let isKVPRegex = /^[^:]+[:][^:]+$/gm;
        if (!keyValuePairString.match(isKVPRegex)) {
            console.error(ErrorMessage);
            return null;
        }
        ;
        let keyValuePairArray = keyValuePairString.split(':');
        if (keyValuePairArray.length != 2) {
            console.error(ErrorMessage);
            return null;
        }
        ;
        return keyValuePairArray;
    }
}
exports.default = Tokenizer;
