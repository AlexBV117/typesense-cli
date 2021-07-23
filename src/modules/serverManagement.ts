"use strict";
const typesense = require("typesense");
const file = require("./file");

export class application {
  private date1: any;
  private date2: any;
  private schemas = require("../vars/schemas.json");
  private finalResult = [];
  private node = require("../vars/serverNode.json");
  private client = new typesense.Client(this.node);
  private json: any;
  private collection: any;

  /**
   * EAMPLE:
   *
   * example.indexData(
   *
   * [‘autoSchema’, ‘forumSchema’],
   *
   * [[‘manualData’, ‘examplesData’, ‘referenceData’], [‘forumData’]]
   *
   * );
   *
   * This will index the manual, examples, and reference data sets to the automatic collection
   * The forum data set will be indexed in the forum collection using its own unique schema.
   * @param schemaArray List the schemas you want to index data with here. The data will be indexed to the collection with the same name as the schema.
   * @param dataArray The index of each internal array will correspond to the collection referenced at the same index of the Schema array.
   * @returns An array of successfully indexed documents
   */
  public async indexData(p) {
    this.date1 = new Date();
    this.json = JSON.parse(p);
    await this.getCol();
    console.log("Staring Index...\n");
    this.inputValidation();
    await this.refreshSchemas();
    await this.chunkData();
    // let results = await Promise.all(this.finalResult);
    // console.log(
    //   `\nFinished indexing ${this.getNumberOfIndexed(
    //     this.finalResult
    //   ).toString()} documents into memory in ${this.timeTaken()}`
    // );
    this.date2 = new Date();
    // return results;
  }

  private inputValidation() {
    if (this.schemasExist()) {
      this.dataExists();
    }
  }

  private schemasExist() {
    for (let i = 0; i < this.json.length; i++) {
      if (!this.schemas[this.json[i].collection]) {
        throw new Error(
          `"${this.json[i].collection}" is not a known collection!!!`
        );
      }
    }
    return true;
  }

  private dataExists() {
    for (let i = 0; i < this.json.length; i++) {
      for (let i2 = 0; i2 < this.json[i].data.length; i2++) {
        if (!file.directoryExists(this.json[i].data[i2])) {
          throw new Error(
            `Path to data file does not exist: ${this.json[i].data[i2]}`
          );
        }
      }
    }
    return true;
  }
  /**
   * deleates the old Schemas from the server and creates new empty ones
   */
  private async refreshSchemas() {
    for (let i = 0; i < this.json.length; i++) {
      if (this.alreadyACollection(i)) {
        console.log(`Refreshing ${this.json[i].collection} collection:`);
        try {
          await this.client.collections(this.json[i].collection).delete();
          console.log(`├── Old ${this.json[i].collection} collection deleted`);
          await this.client
            .collections()
            .create(this.schemas[this.json[i].collection]);
          console.log(`└── New ${this.json[i].collection} collection created`);
        } catch {
          (error) => {
            console.log(error);
          };
        }
      } else {
        console.log(`Creating the ${this.json[i].collection} collection:`);
        try {
          await this.client
            .collections()
            .create(this.schemas[this.json[i].collection]);
          console.log(`└── ${this.json[i].collection} collection created`);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  private alreadyACollection(i) {
    for (let i2 = 0; i2 < this.collection.length; i2++) {
      if (this.collection[i2].name === this.json[i].collection) {
        return true;
      }
    }
    return false;
  }

  private async getCol() {
    this.collection = await this.client.collections().retrieve();
  }

  private async chunkData() {
    for (let i = 0; i < this.json.length; i++) {
      console.log(`\n${this.json[i].collection}:`);
      for (let i2 = 0; i2 < this.json[i].data.length; i2++) {
        let last: boolean;
        if (i2 === this.json[i].data.length - 1) {
          last = true;
        } else {
          last = false;
        }
        let chunkSize = 10000;
        let data = require(this.json[i].data[i2]);
        if (data.length < chunkSize) {
          await this.indexToCollections(i, data, last);
        } else {
          while (data.length > chunkSize) {
            let ret = data.splice(0, chunkSize);
            await this.indexToCollections(i, ret, false);
          }
          await this.indexToCollections(i, data, last);
        }
      }
    }
  }

  timeTaken() {
    let time = this.date2 - this.date1;
    let response: string;
    let x: Number;
    if (time >= 60000) {
      x = time / 60000;
      response = `${x.toFixed(2)} minutes`;
      return response;
    } else {
      x = time / 1000;
      response = `${x.toFixed(2)} seconds`;
      return response;
    }
  }

  /**
   * takes all the data sets in an array (within the dataArray) and indexes them in the server with the realted schema
   */
  private async indexToCollections(
    i,
    dataAtIndex: Array<object>,
    last: boolean
  ) {
    try {
      const returned = await this.client
        .collections(this.json[i].collection)
        .documents()
        .import(dataAtIndex);
      const failed = returned.filter((item) => item.success === false);
      if (failed.length > 0) {
        throw new Error(`└── Error Indexing Items`);
      }
      this.finalResult.push(returned);
      if (last) {
        console.log(
          `└── Successfully indexed ${dataAtIndex.length} docunents into the ${this.json[i].collection} collection`
        );
      } else {
        console.log(
          `├── Successfully indexed ${dataAtIndex.length} docunents into the ${this.json[i].collection} collection`
        );
      }
    } catch (error) {
      console.log(error);
      for (let i = 0; i < error.importResults.length; i++) {
        if (error.importResults[i].success === false) {
          console.log(`Error With Document: ${error.importResults[i].error}`);
        }
      }
    }
  }
  // public async createCollection() {
  //   try {
  //     await this.client.collections().create(this.schemas.forum);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  /**
   * counts the number of successfully indexed documents
   * @param indexedData array of all successfully indexed documents
   * @returns Type: number
   */
  private getNumberOfIndexed(indexedData: Array<any>) {
    let dataSet = indexedData.length;
    let count = 0;
    for (let i = 0; i < dataSet; i++) {
      let setLength = indexedData[i].length;
      count += setLength;
    }
    return count;
  }
  /**
   *   This will return all the collections available on the typesense server.
   *
   * Typical response:
   *
   * [{
   *
   *  created_at: 1625751485,
   *
   *  default_sorting_field: '',
   *
   *  fields: [
   *
   *  [Object], [Object],
   *
   *  ],
   *
   *  name: 'automatic',
   *
   *  num_documents: 3906,
   *
   *  num_memory_shards: 4
   *
   * }]
   */
  public async collections() {
    let collections = await this.client.collections().retrieve();
    console.log(collections);
  }
  /**
   * It will remove all collections named in the array
   * If the collection does not exist then it will throw an error
   * @param collection
   */
  public async deleteCollection(collection: Array<string>) {
    for (let i = 0; i < collection.length; i++) {
      try {
        await this.client.collections(collection[i]).delete();
      } catch (error) {
        console.log(error);
      }
      console.log(`${collection[i]} deleted`);
    }
  }
  /**
   * Returns a list of all the available schemas.
   */
  // public schemaList() {
  //   console.log(`
  //   {
  //     ${JSON.stringify(this.schemasObj, null, "   ")},
  //   }
  //   `);
  // }
  /**
   * Creates a new api key
   * If no arguments are passed then a search only key will be made that can search across all collections.
   * Only give search only keys to the client.
   * The Full API key is only given when it is created so make a note of it somewhere.
   * @param description Internal description to identify what the key is for
   * @param isAdmin If true then a new admin key will be created, If false the key is only allowed to make search requests.
   * @param collections A lsit of all collections that the key can access
   */
  public async makeKey(
    description?: string,
    isAdmin?: boolean,
    collections?: Array<string>
  ) {
    let privileges = [];
    let cols = [];
    if (isAdmin) {
      privileges.push("*");
    } else {
      privileges.push("documents:search");
    }
    if (collections) {
      cols = collections;
    } else {
      cols.push("*");
    }
    try {
      let newKey = await this.client.keys().create({
        description: description,
        actions: privileges,
        collections: cols,
      });
      console.log(newKey);
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * returns all the active api keys
   */
  public async getKeys() {
    let key = await this.client.keys().retrieve();
    console.log(JSON.stringify(key, null, "  "));
  }
  /**
   * Deletes a specific API key
   * @param id The ID of the key you want to remove. Use .getKeys() to get the key id
   */
  public removeKey(id: number) {
    this.client.keys(id).delete();
  }

  public test(x) {
    console.log(x);
  }
}
