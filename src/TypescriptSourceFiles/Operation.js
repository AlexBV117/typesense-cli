"use strict";
exports.__esModule = true;
var Operation = /** @class */ (function () {
    function Operation() {
        this.h = process.env.HOME;
        this.typesense = require("typesense");
        this.settings = require(this.h + "/.typesense-cli/typesense-cli.config.json");
    }
    Operation.prototype.Operation = function () {
        this.node = this.settings.serverNode;
        this.client = this.typesense.Client(this.node);
    };
    Operation.prototype.test = function (word) {
        this.start_time = new Date();
        console.log("".concat(word, " <--- that word is pretty dumb"));
        this.finish_time = new Date();
        console.log(this.timeTaken());
    };
    Operation.prototype.timeTaken = function () {
        var time = this.finish_time.getMilliseconds() - this.start_time.getMilliseconds();
        var response;
        var x;
        if (time >= 60000) {
            x = time / 60000;
            response = "".concat(x.toFixed(2), " minutes");
            return response;
        }
        else {
            x = time / 1000;
            response = "".concat(x.toFixed(2), " seconds");
            return response;
        }
    };
    return Operation;
}());
exports["default"] = Operation;
