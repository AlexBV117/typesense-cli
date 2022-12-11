"use strict";
export class Operation {
    private h = process.env.HOME;
    private typesense = require("typesense");
    private settings = require(this.h + "/.typesense-cli/typesense-cli.config.json");
    private node;
    public client;
    // private start_time: Date;
    // private finish_time: Date;
    
    constructor(...args: any) {
        console.log(args);
        this.node = this.settings.serverNode;                   // typesense server node specified in the config file
        this.client = new this.typesense.Client(this.node);     // client to be used for process
        if(this.client == null || this.client == undefined){
            console.error("Error: Unable to create client.");
        }
    }

    /**
     * Calculates the time difference between two date objects and generates an easily understood message for the user
     * @returns message informing of the time taken with appropriate grammar
     */
    // public timeTaken() {
    //     let time = this.finish_time.valueOf() - this.start_time.valueOf();
    //     let response: string;
    //     let x: Number;
    //     if (time >= 60000) {
    //       x = time / 60000;
    //       response = `${x.toFixed(2)} minute${(x==1)? "" : "s"}`;
    //       return response;
    //     } else {
    //       x = time / 1000;
    //       response = `${x.toFixed(2)} second${(x==1)? "" : "s"}`;
    //       return response;
    //     }
    //   }
}