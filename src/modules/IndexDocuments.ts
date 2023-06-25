import RunTime from "../RunTime";
import { collection, response } from "../interfaces/TypesenseResponse";
import Index_Token from "../interfaces/Index";
import { readFileSync, existsSync } from "fs";
// runtime sits globally so that it can always be accessed for logging
const runtime = RunTime.getInstance();

export default class IndexDocuments {
  private token: Index_Token;

  constructor(token: Index_Token) {
    this.token = token;
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
            throw new Error(
              `Data Reference Error: ${args[i]} no such file or directory`
            );
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
      runtime.logger.error(error);
      return null;
    }
  }
  /**
   * Handles the logic for indexing documents to the typesense server
   */
  public async processToken() {
    try {
      // Does the provided collection have a defined schema
      if (
        !runtime.settings.getSchema().hasOwnProperty(this.token.data.collection)
      ) {
        throw new Error(
          `Collection Error: ${this.token.data.collection} is not defined in the schemas.json`
        );
      }
      // Refresh the collection on the server if we are not appending any data
      if (!this.token.data.append) {
        await this.refreshCollections(
          runtime.settings.getSchema()[this.token.data.collection]
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
        runtime.logger.log(
          `\n╿Indexing raw data into ${this.token.data.collection}`
        );
        await this.indexRawData(this.token.data.data_raw);
      }
    } catch (error) {
      runtime.logger.error(error);
    }
  }
  /**
   * Will delete then replace the specified collection or create the collection if it doesn't exist
   * @param _schema Valid JSON string defining the collection
   */
  private async refreshCollections(_schema: string) {
    runtime.logger.log(
      `\n╿Refreshing ${this.token.data.collection} collection:`
    );
    // Set the collection state
    let _collections: Array<collection>;
    let _collectionExists: boolean = false;
    // Get the collections from the server
    _collections = await runtime.settings.client
      .collections()
      .retrieve()
      .then(
        (data: Array<collection>) => {
          return data;
        },
        (error: string) => {
          runtime.logger.error(error);
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
      await runtime.settings.client
        .collections(this.token.data.collection)
        .delete()
        .then(
          () => {
            runtime.logger.log("├── Old collection deleted");
          },
          (error: string) => {
            runtime.logger.error(error);
            throw new Error(
              "Collection Error: Unable to delete the collection from the server"
            );
          }
        );
    }
    // Recreate the collection on the server
    await runtime.settings.client
      .collections()
      .create(_schema)
      .then(
        () => {
          runtime.logger.log("└── New collection created");
        },
        (error: string) => {
          runtime.logger.error(error);
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
    runtime.logger.log(
      `\n╿Indexing ${path} into ${this.token.data.collection}`
    );
    let file_raw: string = readFileSync(path, "utf8");
    let file_parsed: Array<object>;
    //  As the cli chunks the documents before indexing them it needs to take
    // any json lines files and convert them to an iterable object
    if (file_raw.match(Json_lines_regex)) {
      file_parsed = this.jsonLinesToArray(file_raw);
    } else {
      file_parsed = JSON.parse(file_raw);
    }
    await this.indexRawData(file_parsed);
  }

  /**
   * The main function that actually handel's the indexing
   * @param data this is an iterable JSON array containing the documents to be indexed
   */
  private async indexRawData(data: Array<object>) {
    let errors: Array<object> = [];
    // const json_array_regex = /^\[[^]*\]$/g;
    if (data.length == 0) return;
    const chunkSize = runtime.settings.getConfig().chunkSize;
    const iterations = data.length / chunkSize;
    for (let i = 0; i <= iterations; i++) {
      let treeChar = iterations <= i + 1 ? "└──" : "├──";

      let chunk: Array<object> = data.slice(i * chunkSize, (i + 1) * chunkSize);

      let chunkLines = this.jsonArrayToLines(chunk);

      let response: string = await runtime.settings.client
        .collections(this.token.data.collection)
        .documents()
        .import(chunkLines, { action: "create" });

      let responses: Array<response> = this.parseResponse(response);

      let failed = responses.filter((item: response) => item.success === false);

      if (failed.length > 0) {
        runtime.logger.warn(
          `${treeChar} Error: Indexing ${failed.length} of ${chunk.length} Items into ${this.token.data.collection} collection.`
        );
        errors.push(failed);
      } else {
        runtime.logger.log(
          `${treeChar} Successfully indexed ${chunk.length} items into the ${this.token.data.collection} collection`
        );
      }
    }
    return errors;
  }

  private jsonArrayToLines(jsonArray: Array<object>): string {
    return jsonArray.map((obj: object) => JSON.stringify(obj)).join("\n");
  }

  private jsonLinesToArray(lines: string): Array<object> {
    return lines.split("\n").map((str: string) => {
      if (str == "") return;
      else return JSON.parse(str);
    });
  }

  private parseResponse(lines: string): Array<response> {
    return lines.split("\n").map((str: string) => {
      if (str == "") return;
      else return JSON.parse(str);
    });
  }
}
