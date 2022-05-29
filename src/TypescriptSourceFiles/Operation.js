"use strict";
exports.__esModule = true;
exports.Operation = void 0;
var Operation = /** @class */ (function () {
    function Operation() {
        this.h = process.env.HOME;
        this.typesense = require("typesense");
        this.settings = require(this.h + "/.typesense-cli/typesense-cli.config.json");
        this.node = this.settings.serverNode; // typesense server node specified in the config file
        this.client = new this.typesense.Client(this.node); // client to be used for process
        if (this.client == null || this.client == undefined) {
            console.error("Error: Unable to create client.");
        }
    }
    /**
     * Calculates the time difference between two date objects and generates an easily understood message for the user
     * @returns message informing of the time taken with appropriate grammar
     */
    Operation.prototype.timeTaken = function () {
        var time = this.finish_time.valueOf() - this.start_time.valueOf();
        var response;
        var x;
        if (time >= 60000) {
            x = time / 60000;
            response = "".concat(x.toFixed(2), " minute").concat((x == 1) ? "" : "s");
            return response;
        }
        else {
            x = time / 1000;
            response = "".concat(x.toFixed(2), " second").concat((x == 1) ? "" : "s");
            return response;
        }
    };
    return Operation;
}());
exports.Operation = Operation;
