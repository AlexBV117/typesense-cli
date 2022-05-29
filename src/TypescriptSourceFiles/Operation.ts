"use strict";
export default class Operation {
    private h = process.env.HOME;
    private typesense = require("typesense");
    private settings = require(this.h + "/.typesense-cli/typesense-cli.config.json");
    private node: JSON;
    private client: Object 
    private start_time: Date;
    private finish_time: Date;
    
    public Operation() {
        this.node = this.settings.serverNode;
        this.client = this.typesense.Client(this.node);
    }

    public test(word: String) {
        this.start_time = new Date();
        console.log(`${word} <--- that word is pretty dumb`);
        this.finish_time = new Date();
        console.log(this.timeTaken());
    }

    public timeTaken() {
        let time = this.finish_time.getMilliseconds() - this.start_time.getMilliseconds();
        let response: string;
        let x: Number;
        if (time >= 60000) {
          x = time / 60000;
          response = `${x.toFixed(2)} minutes`;
          return response;
        } else {
          x = time / 1000;
          response = `${x.toFixed(2)} seconds`;
          return response;
        }
      }
}