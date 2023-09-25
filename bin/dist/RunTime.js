import { join } from "path";
import { existsSync, readFileSync } from "fs";
class Settings {
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
        this.home = this.setRootDirPath();
        this.config = require(this.home + "/.typesense/config.json");
        this.schema = require(this.home + "/.typesense/schemas.json");
        this.title = readFileSync(this.home + "/.typesense/title.txt", "utf-8");
        this.client = new this.typesense.Client(this.config.serverNode);
        if (this.client === null || this.client === undefined) {
            throw new Error("Critical Error: Unable to create client.");
        }
    }
    static getInstance() {
        if (Settings.single_instance === null) {
            Settings.single_instance = new Settings();
        }
        return Settings.single_instance;
    }
    setRootDirPath() {
        const default_dir = join(__dirname, "..", "..");
        if (existsSync(default_dir)) {
            return default_dir;
        }
        throw new Error("Critical Error: Unable to locate the required configuration files. Ending process");
    }
}
Settings.single_instance = null;
export default Settings;
