import { readFileSync } from "fs";
import RunTime from "../RunTime";
import Logger from "../Logger";
const runtime = RunTime.getInstance();
const logger = Logger.getInstance();
export default class Index {
    constructor(token) {
        this.token = token;
    }
    static parse(args, _append) {
        const filePathRegex = /((?:[^\/]*\/)*.*\.json)/gm;
        try {
            let token = {
                constructor: Index.prototype.constructor,
                modifiers: {
                    append: false,
                    upsert: false,
                    update: false,
                    emplace: false,
                },
                data: {
                    collection: "",
                    data_files: [],
                    data_raw: [],
                },
            };
            for (let i = args.length - 1; i > 0; i--) {
                let currentArgument = args[i];
                switch (true) {
                    case filePathRegex.test(currentArgument):
                        logger.log("IS FILE");
                        break;
                }
            }
            return token;
        }
        catch (error) {
            logger.error(error);
            return null;
        }
    }
    async processToken() {
        try {
            if (!runtime.getSchema().hasOwnProperty(this.token.data.collection)) {
                throw new Error(`Collection Error: ${this.token.data.collection} is not defined in the schemas.json`);
            }
            if (!this.token.modifiers.append) {
                await this.refreshCollections(runtime.getSchema()[this.token.data.collection]);
            }
            if (this.token.data.data_files.length > 0) {
                for (let file in this.token.data.data_files) {
                    await this.indexFile(this.token.data.data_files[file]);
                }
            }
            if (this.token.data.data_raw.length > 0) {
                logger.log(`\n╿Indexing raw data into ${this.token.data.collection}`);
                await this.indexRawData(this.token.data.data_raw);
            }
        }
        catch (error) {
            logger.error(error);
        }
    }
    async refreshCollections(_schema) {
        logger.log(`\n╿Refreshing ${this.token.data.collection} collection:`);
        let _collections;
        let _collectionExists = false;
        _collections = await runtime.client
            .collections()
            .retrieve()
            .then((data) => {
            return data;
        }, (error) => {
            logger.error(error);
            throw new Error("Collection Error: Unable to fetch the collections from the server");
        });
        _collections.forEach((collection) => {
            if (collection.name == this.token.data.collection) {
                _collectionExists = true;
            }
        });
        if (_collectionExists) {
            await runtime.client
                .collections(this.token.data.collection)
                .delete()
                .then(() => {
                logger.log("├── Old collection deleted");
            }, (error) => {
                logger.error(error);
                throw new Error("Collection Error: Unable to delete the collection from the server");
            });
        }
        await runtime.client
            .collections()
            .create(_schema)
            .then(() => {
            logger.log("└── New collection created");
        }, (error) => {
            logger.error(error);
            throw new Error("Collection Error: Unable to create a new collection on the server");
        });
    }
    async indexFile(path) {
        const Json_lines_regex = /^{.*}$/gm;
        logger.log(`\n╿Indexing ${path} into ${this.token.data.collection}`);
        let file_raw = readFileSync(path, "utf8");
        let file_parsed;
        if (file_raw.match(Json_lines_regex)) {
            file_parsed = this.jsonLinesToArray(file_raw);
        }
        else {
            file_parsed = JSON.parse(file_raw);
        }
        await this.indexRawData(file_parsed);
    }
    async indexRawData(data) {
        let errors = [];
        if (data.length == 0)
            return;
        const chunkSize = runtime.getConfig().chunkSize;
        const iterations = data.length / chunkSize;
        for (let i = 0; i <= iterations; i++) {
            let treeChar = iterations <= i + 1 ? "└──" : "├──";
            let chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
            let chunkLines = this.jsonArrayToLines(chunk);
            let response = await runtime.client
                .collections(this.token.data.collection)
                .documents()
                .import(chunkLines, { action: "create" });
            let responses = this.parseResponse(response);
            let failed = responses.filter((item) => item.success === false);
            if (failed.length > 0) {
                logger.warn(`${treeChar} Error: Indexing ${failed.length} of ${chunk.length} Items into ${this.token.data.collection} collection.`);
                errors.push(failed);
            }
            else {
                logger.log(`${treeChar} Successfully indexed ${chunk.length} items into the ${this.token.data.collection} collection`);
            }
        }
        return errors;
    }
    jsonArrayToLines(jsonArray) {
        return jsonArray.map((obj) => JSON.stringify(obj)).join("\n");
    }
    jsonLinesToArray(lines) {
        return lines.split("\n").map((str) => {
            if (str == "")
                return;
            else
                return JSON.parse(str);
        });
    }
    parseResponse(lines) {
        return lines.split("\n").map((str) => {
            if (str == "")
                return;
            else
                return JSON.parse(str);
        });
    }
}
