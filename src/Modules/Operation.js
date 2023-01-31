("use strict");
export default class Operation {
    constructor(home) {
        this.typesense = require("typesense");
        this._home = home;
        this.settings = require(home + "/config/typesense-cli.config.json");
        this.schemas = require(home + "/config/schemas.json");
        this.node = this.settings.serverNode; // typesense server node specified in the config file
        this.client = new this.typesense.Client(this.node); // client to be used for process
        if (this.client === null || this.client === undefined) {
            console.error("Error: Unable to create client.");
        }
    }
    /**
     * Generates an array of length 2 from a string that maps a know word to a set of data
     * @param kvp String that needs to be split into a kvp
     * @returns Null if the sting doesn't match the regex or an array where the first item is the key and the second item is the value
     */
    static generateKVP(kvp) {
        const kvpRegex = /[^=]*=[^=]*/gm;
        if (typeof kvp.match(kvpRegex) !== null) {
            const result_array = kvp
                .split("=")
                .filter((elem) => elem)
                .slice(0, 2);
            if (result_array.length != 2) {
                return null;
            }
            else
                return result_array;
        }
        else {
            return null;
        }
    }
}
