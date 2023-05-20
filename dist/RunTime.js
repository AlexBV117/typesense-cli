import { join } from "path";
import { existsSync, readFileSync } from "fs";
export default class RunTime {
    getHome() {
        return this.home;
    }
    getConfig() {
        return this.config;
    }
    getSchema() {
        return this.schema;
    }
    getTitle() {
        return this.title;
    }
    constructor() {
        this.typesense = require("typesense");
        try {
            this.home = this.setRootDirPath();
            this.config = require(this.home + "/config/typesense-cli.config.json");
            this.schema = require(this.home + "/config/schemas.json");
            this.title = readFileSync(this.home + "/config/title.txt", "utf-8");
            this.client = new this.typesense.Client(this.config.serverNode);
            if (this.client === null || this.client === undefined) {
                throw new Error("Critical Error: Unable to create client.");
            }
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
    static getInstance() {
        if (RunTime.single_instance === null) {
            RunTime.single_instance = new RunTime();
        }
        return RunTime.single_instance;
    }
    setRootDirPath() {
        const default_dir = join(__dirname, "..");
        if (existsSync(default_dir)) {
            return default_dir;
        }
        throw new Error("Critical Error: Unable to locate the required configuration files. Ending process");
    }
}
RunTime.single_instance = null;
