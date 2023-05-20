import Operation from "./Operation";
import { readFileSync, existsSync } from "fs";
export default class IndexDocuments extends Operation {
    constructor(token, settings) {
        super();
        this.token = token;
        this.settings = settings;
    }
    static parse(args, _append) {
        const filePathRegex = /((?:[^\/]*\/)*.*\.json)/gm;
        try {
            let token = {
                constructor: IndexDocuments.prototype.constructor,
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
            token.data.collection = args[0];
            for (let i = args.length - 1; i > 0; i--) {
                if (args[i].match(filePathRegex)) {
                    if (existsSync(args[i])) {
                        token.data.data_files.push(args[i]);
                    }
                    else {
                        throw `Data Reference Error: ${args[i]} no such file or directory`;
                    }
                }
                else {
                    try {
                        let data = JSON.parse(args[i]);
                        if (data instanceof Array) {
                            token.data.data_raw.concat(data);
                        }
                        else {
                            token.data.data_raw.push(data);
                        }
                    }
                    catch (error) {
                        console.error(error);
                    }
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
        try {
            let _schema;
            if (!this.settings.getSchema().hasOwnProperty(this.token.data.collection)) {
                throw new Error(`Collection Error: ${this.token.data.collection} is not defined in the schemas.json`);
            }
            _schema = this.settings.getSchema()[this.token.data.collection];
            if (!this.token.data.append) {
                await this.refreshCollections(_schema);
            }
            for (let file in this.token.data.data_files) {
                await this.indexFile(this.token.data.data_files[file]);
            }
            await this.indexRawData(this.token.data.data_raw);
            return;
        }
        catch (error) {
            console.error(error);
        }
    }
    async refreshCollections(_schema) {
        console.log(`Refreshing ${this.token.data.collection} collection:`);
        let _collections;
        let _collectionExists = false;
        _collections = await this.settings.client
            .collections()
            .retrieve()
            .then((data) => {
            return data;
        }, (error) => {
            console.error(error);
            throw new Error(`Collection Error:`);
        });
        _collections.forEach((collection) => {
            if (collection.name == this.token.data.collection) {
                _collectionExists = true;
            }
        });
        if (_collectionExists) {
            await this.settings.client
                .collections(this.token.data.collection)
                .delete()
                .then(() => {
                console.log("├── Old collection deleted");
            }, (error) => {
                console.error(error);
                throw new Error(`Collection Error:`);
            });
        }
        await this.settings.client
            .collections()
            .create(_schema)
            .then(() => {
            console.log("└── New collection created");
        }, (error) => {
            console.error(error);
            throw new Error(`Collection Error:`);
        });
        return;
    }
    async indexFile(path) {
        console.log(path);
        let file_raw = readFileSync(path, "utf8");
        let file_parsed = JSON.parse(file_raw);
        await this.indexRawData(file_parsed);
    }
    async indexRawData(data) {
        const chunkSize = this.settings.getConfig().chunkSize;
        let ittr = data.length / chunkSize;
        for (let i = 0; i <= ittr; i++) {
            let chunk = data.slice(i * chunkSize, chunkSize);
            this.settings.client
                .collections(this.token.data.collection)
                .documents()
                .import(chunk);
        }
    }
}
