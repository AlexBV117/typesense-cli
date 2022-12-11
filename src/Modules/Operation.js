"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = void 0;
class Operation {
    // private start_time: Date;
    // private finish_time: Date;
    constructor(...args) {
        this.h = process.env.HOME;
        this.typesense = require("typesense");
        this.settings = require(this.h + "/.typesense-cli/typesense-cli.config.json");
        console.log(args);
        this.node = this.settings.serverNode; // typesense server node specified in the config file
        this.client = new this.typesense.Client(this.node); // client to be used for process
        if (this.client == null || this.client == undefined) {
            console.error("Error: Unable to create client.");
        }
    }
}
exports.Operation = Operation;
