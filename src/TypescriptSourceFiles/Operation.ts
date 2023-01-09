"use strict";
export default class Operation {
    public _home = process.env.HOME ;
    public typesense = require("typesense");
    public settings = require("../../config/typesense-cli.config.json");
    public node;
    public client;

    constructor(home?:string) {
        this.node = this.settings.serverNode;                   // typesense server node specified in the config file
        this.client = new this.typesense.Client(this.node);     // client to be used for process
        if(this.client == null || this.client == undefined){
            console.error("Error: Unable to create client.");
        }
    }
}