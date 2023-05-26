import { collection, response } from "../interfaces/TypesenseResponse";
import Index_Token from "../interfaces/Index";
import RunTime from "../RunTime";
import { readFileSync, existsSync } from "fs";

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
      // Are we deleting the existing collection on the server before indexing
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
  /**
   * Handles the logic for indexing documents to the typesense server
   * @returns Any meta data required for logging and error handling see the metadata interface
   */
  public async processToken() {
    // Does the provided collection have a defined schema
    if (!this.settings.getSchema().hasOwnProperty(this.token.data.collection)) {
      throw new Error(
        `Collection Error: ${this.token.data.collection} is not defined in the schemas.json`
      );
    }
    // Refresh the collection on the server if we are not appending any data
    if (!this.token.data.append) {
      await this.refreshCollections(
        this.settings.getSchema()[this.token.data.collection]
      );
    }
    // Index all data provided from files on disc
    if (this.token.data.data_files.length > 0) {
      for (let file in this.token.data.data_files) {
        await this.indexFile(this.token.data.data_files[file]);
      }
    }
    // Index the raw data passed by the command line
    if (this.token.data.data_raw.length > 0) {
      console.log(`\nIndexing raw data into ${this.token.data.collection}`);
      await this.indexRawData(this.token.data.data_raw);
    }
    return;
  }
  /**
   * Will delete then replace the specified collection or create the collection if it doesn't exist
   * @param _schema Valid JSON string defining the collection
   */
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
          throw new Error(
            "Collection Error: Unable to fetch the collections from the server"
          );
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
            throw new Error(
              "Collection Error: Unable to delete the collection from the server"
            );
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
          throw new Error(
            "Collection Error: Unable to create a new collection on the server"
          );
        }
      );
  }
  /**
   * Reads in the specified file and indexes it with the indexRawData method
   * @param path path to the data file from the command line
   */
  private async indexFile(path: string) {
    const Json_lines_regex: RegExp = /^{.*}$/gm;
    console.log(`\nIndexing ${path} into ${this.token.data.collection}`);
    let file_raw: string = readFileSync(path, "utf8");
    let file_parsed: Array<object>;
    if (file_raw.match(Json_lines_regex)) {
      file_parsed = file_raw.split("\n").map((str: string) => {
        if (str != "") {
          return JSON.parse(str);
        }
      });
    } else {
      file_parsed = JSON.parse(file_raw);
    }
    await this.indexRawData(file_parsed);
  }

  /**
   *
   * @param data
   * @returns
   */
  private async indexRawData(data: Array<object>) {
    // const json_array_regex = /^\[[^]*\]$/g;
    if (data.length == 0) return;
    const chunkSize = this.settings.getConfig().chunkSize;
    const iterations = data.length / chunkSize;
    try {
      for (let i = 0; i <= iterations; i++) {
        let treeChar = iterations <= i + 1 ? "└──" : "├──";
        let chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
        let chunkLines = this.jsonToLines(chunk);
        let response = await this.settings.client
          .collections(this.token.data.collection)
          .documents()
          .import(chunkLines, { action: "create" });
        let responses = response.split("\n").map((str: string) => {
          if (str != "") {
            return JSON.parse(str);
          }
          return "";
        });
        let failed = responses.filter(
          (item: response) => item.success === false
        );
        if (failed.length > 0) {
          console.error(
            `${treeChar} Error: Indexing ${failed.length} of ${chunk.length} Items into ${this.token.data.collection} collection.`
          );
        } else {
          console.log(
            `${treeChar} Successfully indexed ${chunk.length} items into the ${this.token.data.collection} collection`
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  private jsonToLines(json: Array<object> | string): string | Error {
    let return_string: string;
    if (typeof json == "string") {
      json = JSON.parse(json);
    }
    if (typeof json == "object") {
      return_string = json.map((obj: object) => JSON.stringify(obj)).join("\n");
    } else {
      throw new Error(
        `Type Error: Expected JSON to be of type object got ${typeof json}`
      );
    }
    return return_string;
  }
  // private async processResponse(responses: Array<response>) {}
}
