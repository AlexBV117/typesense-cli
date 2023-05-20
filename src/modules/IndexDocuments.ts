import Index_Token from "../interfaces/Index.interface";
import RunTime from "../RunTime";
import { readFileSync, existsSync } from "fs";
/**
 * Defines the collection object returned by the server
 */
interface collection {
  created_at: number;
  default_sorting_field: string;
  fields: Array<any>;
  name: string;
  num_documents: number;
  symbols_to_index: Array<any>;
  token_separators: Array<any>;
}

export default class IndexDocuments {
  private token: Index_Token;
  private settings: any;

  constructor(token: Index_Token, settings: RunTime) {
    this.token = token;
    this.settings = settings;
  }

  public static parse(args: string[], _append?: boolean) {
    const filePathRegex: RegExp = /((?:[^\/]*\/)*.*\.json)/gm;
    try {
      // Create the Index_Token that structures the data passed by the command line
      let token: Index_Token = {
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
      // The first argument for the index flag is the collection.
      token.data.collection = args[0];
      // Iterate over the remaining args.
      for (let i = args.length - 1; i > 0; i--) {
        if (args[i].match(filePathRegex)) {
          if (existsSync(args[i])) {
            // Add the file paths to the paths array.
            token.data.data_files.push(args[i]);
          } else {
            throw `Data Reference Error: ${args[i]} no such file or directory`;
          }
        } else {
          let data = JSON.parse(args[i]);
          // Add the objects to the raw data array
          if (data instanceof Array) {
            token.data.data_raw.concat(data);
          } else {
            token.data.data_raw.push(data);
          }
        }
      }
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  public async processToken() {
    try {
      // The schema defined in the schemas.json file
      let _schema: string;
      // Does the provided collection have a defined schema
      if (
        !this.settings.getSchema().hasOwnProperty(this.token.data.collection)
      ) {
        throw new Error(
          `Collection Error: ${this.token.data.collection} is not defined in the schemas.json`
        );
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
    } catch (error) {
      console.error(error);
    }
  }
  private async refreshCollections(_schema: string) {
    console.log(`Refreshing ${this.token.data.collection} collection:`);
    // Set the collection state
    let _collections: Array<collection>;
    let _collectionExists: boolean = false;
    // Get the collections from the server
    _collections = await this.settings.client
      .collections()
      .retrieve()
      .then(
        (data: Array<collection>) => {
          return data;
        },
        (error: string) => {
          console.error(error);
          throw new Error(`Collection Error:`);
        }
      );
    // Check if the collection already exists on the server
    _collections.forEach((collection) => {
      if (collection.name == this.token.data.collection) {
        _collectionExists = true;
      }
    });
    // If it exists delete it
    if (_collectionExists) {
      await this.settings.client
        .collections(this.token.data.collection)
        .delete()
        .then(
          () => {
            console.log("├── Old collection deleted");
          },
          (error: string) => {
            console.error(error);
            throw new Error(`Collection Error:`);
          }
        );
    }
    // Recreate the collection on the server
    await this.settings.client
      .collections()
      .create(_schema)
      .then(
        () => {
          console.log("└── New collection created");
        },
        (error: string) => {
          console.error(error);
          throw new Error(`Collection Error:`);
        }
      );
    return;
  }
  private async indexFile(path: string) {
    console.log(path);
    let file_raw = readFileSync(path, "utf8");
    let file_parsed = JSON.parse(file_raw);
    await this.indexRawData(file_parsed);
  }
  private async indexRawData(data: Array<object>) {
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
