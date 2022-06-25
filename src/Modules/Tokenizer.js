"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tokenizer = /** @class */ (function () {
    function Tokenizer(args) {
        this.index = 0;
        this.flagsMap = {
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
                remove: false,
                name: []
            },
            keys: {
                new: false,
                remove: false,
                actions: [],
                collections: [],
                description: "",
                value: null,
                expiresAt: "",
                id: 0
            },
        };
        this.commands = {
            index: {
                regex: /^(--index)$|^(-i)$/gm,
                function: function (that) {
                    that.flagsMap.index.index = true;
                    that.formatIndexFlag();
                }
            },
            append: {
                regex: /^(--append)$|^(-a)$/gm,
                function: function (that) {
                    that.flagsMap.index.append = true;
                    that.flagsMap.index.index = true;
                    that.formatIndexFlag();
                }
            },
            schemas: {
                regex: /^(--schemas)$|^(-s)$/gm,
                function: function (that) {
                    console.log("l");
                }
            },
            version: {
                regex: /^(--version)$|^(-v)$/gm,
                function: function (that) {
                    console.log("o");
                }
            },
            server: {
                regex: /^(--server)$/gm,
                function: function (that) {
                    console.log("w");
                }
            },
            collections: {
                regex: /^(--collections)$|^(-c)$/gm,
                function: function (that) {
                    console.log("r");
                }
            },
            key: {
                regex: /^(--key)$|^(-k)$/gm,
                function: function (that) {
                    that.formatKeyFlag();
                }
            },
            // new :{
            //     regex : /^(--new)$|^(-n)$/gm,
            //     function : function (that: Tokenizer) {
            //         that.flagsMap.keys.new = true;
            //         that.formatKeyFlag();
            //     }
            // },
            // remove :{
            //     regex : /^(--remove)$|^(-r)$/gm,
            //     function : function (that: Tokenizer) {
            //         that.flagsMap.collections.remove = true;
            //         that.flagsMap.keys.remove = true;
            //     }
            // },
        };
        var isFlagRegex = /-{1,2}[a-zA-Z]+/gm;
        this.args = args.splice(2, args.length);
        for (this.index = 0; this.index < this.args.length; this.index++) {
            if (this.args[this.index].match(isFlagRegex)) {
                this.processFlag(this.args[this.index]);
            }
        }
        console.log(this.flagsMap);
    }
    Tokenizer.prototype.processFlag = function (currentArgument) {
        for (var command in this.commands) {
            if (currentArgument.match(this.commands[command].regex)) {
                this.index++;
                this.commands[command].function(this);
            }
            ;
        }
    };
    Tokenizer.prototype.formatIndexFlag = function () {
        var isCollection = /c:.+:.+,?/gm;
        var getNames = /c:(.+):(.+),?/gm;
        var results;
        var collectionName;
        var collectionData;
        for (; this.index < this.args.length; this.index++) {
            if (this.args[this.index].match(isCollection)) {
                results = getNames.exec(this.args[this.index].normalize());
                if (results == null)
                    return;
                getNames.lastIndex = 0;
                collectionName = results[1];
                collectionData = results[2].split(',');
                this.flagsMap.index.collections.push(collectionName);
                this.flagsMap.index.data.push(collectionData);
            }
            else {
                console.error("ERROR: unknown argument structure: ".concat(this.args[this.index]));
                this.index--;
                return;
            }
        }
    };
    Tokenizer.prototype.formatKeyFlag = function () {
        var keyValuePairRegex = /.+:.+/gm;
        for (; this.index < this.args.length; this.index++) {
            var keyValuePair = this.args[this.index];
            if (!keyValuePair.match(keyValuePairRegex)) {
                console.error("ERROR: ".concat(keyValuePair, " is not a valid key value pair"));
                continue;
            }
            var keyValuePairArray = keyValuePair.split(':');
            var key = keyValuePairArray[0];
            var value = keyValuePairArray[1];
            for (var property in this.flagsMap.keys) {
                if (key == property) {
                    this.flagsMap.keys[property] = value;
                }
            }
        }
    };
    return Tokenizer;
}());
exports.default = Tokenizer;
