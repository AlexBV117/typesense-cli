"Use Strict";
import Operation from "./Operation";
import fs from "fs";
export default class IndexDocuments extends Operation {
    constructor(token, homeDir) {
        super(homeDir);
        this.token = token;
    }
    static parse(args, _append) {
        const filePathRegex = /(?:(?:\/|\.\/|\.\.\/)[^\/\\]+)+(?:\.json)/gm;
        const ObjRegex = /{.*}/gm;
        const ArrayRegex = /\[[^\[\]]*,?\]/gm;
        const fs = require("fs");
        try {
            let token = {
                name: "index",
                data: {
                    append: false,
                    collection: "",
                    data_files: [],
                    data_raw: [],
                },
            };
            if (_append === true) {
                token.data.append = true;
            }
            // The first argument for the index flag is the collection.
            token.data.collection = args[0];
            // Iterate over the remaining args.
            for (let i = args.length - 1; i > 0; i--) {
                if (args[i].match(filePathRegex)) {
                    if (fs.existsSync(args[i])) {
                        // Add the file paths to the paths array.
                        token.data.data_files.push(args[i]);
                    }
                    else {
                        throw `Data Reference Error: ${args[i]} no such file or directory`;
                    }
                }
                else if (args[i].match(ObjRegex)) {
                    // Add raw json objects to the data array.
                    if (args[i].match(ArrayRegex)) {
                        // This takes any array passed as a string to be appended to the raw data array (allows for rested json objects)
                        const tmp = args[i]
                            .replace(/}[\s]?,[\s]?{/gm, "}<comma>{")
                            .replace(/\"\[|\]\"/g, "");
                        token.data.data_raw = token.data.data_raw.concat(tmp.split("<comma>"));
                    }
                    else {
                        // If a single object is passed then just append it to the raw data array
                        token.data.data_raw.push(args[i]);
                    }
                }
                else {
                    // Throw an error if an argument doesn't match the two supported data types.
                    throw `Data Reference Error: ${args[i]} is an invalid argument. Expected a valid file path or a JSON object(s).`;
                }
            }
            return token;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async processToken() {
        return new Promise(async (resolve, reject) => {
            let _schema; // The schema defined in the schemas.json file
            if (!this.schemas.hasOwnProperty(this.token.data.collection)) {
                reject(`Collection Error: ${this.token.data.collection} is not defined in the schemas.json`);
                return;
            }
            else {
                _schema = this.schemas[this.token.data.collection];
                if (!this.token.data.append) {
                    this.refreshCollections(_schema);
                }
                for (let i = this.token.data.data_files.length - 1; i >= 0; i--) {
                    this.indexFile(this.token.data.data_files[i]);
                }
                if (this.token.data.data_raw.length > 0) {
                    this.indexRawData();
                }
            }
        });
    }
    async refreshCollections(_schema) {
        console.log(`Refreshing ${this.token.data.collection} collection:`);
        let _collections;
        let _collectionExists = false;
        _collections = await this.client.collections().retrieve();
        for (let i = _collections.length - 1; i >= 0; i--) {
            if (_collections[i].name == this.token.data.collection) {
                _collectionExists = true;
            }
        }
        if (!_collectionExists) {
            this.client
                .collections()
                .create(_schema)
                .then(() => {
                console.log("└── New collection created");
            }, (error) => {
                console.log("New from scratch");
                console.error(error);
            });
        }
        else {
            await this.client
                .collections(this.token.data.collection)
                .delete()
                .then(() => {
                console.log("├── Old collection deleted");
            }, (error) => {
                console.error(error);
            });
            await this.client
                .collections()
                .create(_schema)
                .then(() => {
                console.log("└── New collection created");
            }, (error) => {
                console.error(error);
            });
        }
    }
    indexFile(path) {
        let file_raw = fs.readFileSync(path, "utf8");
        let file_parsed = JSON.parse(file_raw);
    }
    indexRawData() { }
}
