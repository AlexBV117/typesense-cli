"use strict";
export default class Operation {
    constructor(home) {
        this._home = process.env.HOME;
        this.typesense = require("typesense");
        this.settings = require("../../config/typesense-cli.config.json");
        this.node = this.settings.serverNode; // typesense server node specified in the config file
        this.client = new this.typesense.Client(this.node); // client to be used for process
        if (this.client == null || this.client == undefined) {
            console.error("Error: Unable to create client.");
        }
    }
}
