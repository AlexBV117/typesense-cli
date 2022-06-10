"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tokenizer = /** @class */ (function () {
    function Tokenizer() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.flagsMap = {
            help: "",
            index: "",
            append: "",
            schemas: "",
            version: "",
            server: "",
            collections: "",
            keys: "",
            new: "",
            remove: ""
        };
        this.args = args;
    }
    Tokenizer.prototype.printArgs = function () {
        console.log(this.args);
        return this.flagsMap;
    };
    return Tokenizer;
}());
exports.default = Tokenizer;
