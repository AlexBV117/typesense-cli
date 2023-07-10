import { join } from "path";
import { existsSync, readFileSync } from "fs";

export default class Settings {
  // Static variable reference to check if settings have instantiated
  private static single_instance: Settings | null = null;
  // Variable for the home path of the typesense-cli folder
  private home: string;
  public getHome() {
    return this.home;
  }
  // Variable containing the configuration file data
  private config;
  public getConfig() {
    return this.config;
  }
  // Variable containing the data for the schemas for the collections
  private schema;
  public getSchema(): { [index: string]: any } {
    return this.schema;
  }
  // Variable to store the typesense-cli banner
  private title;
  public getTitle() {
    return this.title;
  }
  // Connections to the server as well as a reference to the typesense sdk
  public client: any;
  public typesense = require("typesense");
  // Private constructor for the settings class. Settings is a singleton class
  private constructor() {
    this.home = this.setRootDirPath();
    this.config = require(this.home + "/.typesense/config.json");
    this.schema = require(this.home + "/.typesense/schemas.json");
    this.title = readFileSync(this.home + "/.typesense/title.txt", "utf-8");
    this.client = new this.typesense.Client(this.config.serverNode);

    if (this.client === null || this.client === undefined) {
      throw new Error("Critical Error: Unable to create client.");
    }
  }
  // Static method to create a single instance of settings
  public static getInstance(): Settings {
    if (Settings.single_instance === null) {
      Settings.single_instance = new Settings();
    }
    return Settings.single_instance;
  }
  // Sets the path of the typescript-cli folder
  private setRootDirPath() {
    const default_dir = join(__dirname, "..", "..");
    if (existsSync(default_dir)) {
      return default_dir;
    }
    throw new Error(
      "Critical Error: Unable to locate the required configuration files. Ending process"
    );
  }
}
