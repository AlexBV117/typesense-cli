"use strict";
const typesense = require("typesense");

export class application {
  private date1: any;
  private date2: any;
  private schemasObj = require("../vars/schemas.json");
  private manualData = require("../data/manual.json");
  private examplesData = require("../data/examples.json");
  private referenceData = require("../data/reference.json");
  private forumData = require("../data/forum.json");
  private finalResult = [];
  private node = require("../vars/serverNode.json");
  private client = new typesense.Client(this.node);
  private schemaArray = [];
  private dataArray = [];
  private get obj() {
    let length = this.schemaArray.length;
    return {
      schema: this.schemaArray,
      data: this.dataArray,
      length: length,
      repeatedSchema: true,
    };
  }
  private dependenciesCheck() {
    console.log("Checking Script Dependencies...");
    let dep = require("../package.json");
    if (
      !dep.dependencies["typesense"] ||
      !dep.dependencies["@babel/runtime"] ||
      (dep.dependencies["typesense"] as string) !== "^0.13.0" ||
      (dep.dependencies["@babel/runtime"] as string) !== "^7.14.6"
    ) {
      throw new Error(
        `ERROR MISSING DEPENDENCIES: This script is dependent on typesense js and @babel/runtime
       Run 'npm install --save typesense@0.13.0' and 'npm intsall --save @babel/runtime@7.14.6'
       Additionally make sure that the script is pointing to the correct package.json file. 
       The default is the package.json located in the same dirrectory as the script.
    `
      );
    }
    console.log("Dependencies ✔\n");
  }
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
  public async indexData(
    schemaArray: Array<string>,
    dataArray: Array<Array<string>>
  ) {
    this.processInput(schemaArray, dataArray);
    console.log("Staring Index...\n");
    this.dependenciesCheck();
    await this.refreshSchemas();
    for (let index = 0; index < this.obj.data.length; index++) {
      let dataAtIndex = this.obj.data[index];
      await this.chunkData(index, dataAtIndex);
    }
    let results = await Promise.all(this.finalResult);
    console.log(
      `\nFinished indexing ${this.getNumberOfIndexed(
        this.finalResult
      ).toString()} documents into memory in ${this.timeTaken()}`
    );
    return results;
  }

  /**
   * deleates the old Schemas from the server and creates new empty ones
   */
  private async refreshSchemas() {
    for (let i = 0; i < this.obj.schema.length; i++) {
      console.log(`Refreshing ${this.obj.schema[i].name} collection:`);
      try {
        this.client.collections(this.obj.schema[i].name).delete();
        console.log(`├── Old ${this.obj.schema[i].name} collection deleated`);
      } catch {
        (error) => {
          console.log(error);
        };
      }
      await this.client.collections().create(this.obj.schema[i]);
      console.log(`└── New ${this.obj.schema[i].name} collection created`);
    }
  }
  private async chunkData(index, dataAtIndex: Array<Array<object>>) {
    this.date1 = new Date();
    console.log(`\n${this.obj.schema[index].name}:`);
    for (let index2 = 0; index2 < dataAtIndex.length; index2++) {
      let last: boolean;
      if (index2 === dataAtIndex.length - 1) {
        last = true;
      } else {
        last = false;
      }
      let x = 0;
      let start = 0;
      let chunkSize = 10000;
      if (dataAtIndex[index2].length < chunkSize) {
        await this.indexToCollections(index, dataAtIndex[index2], last);
      } else {
        while (
          dataAtIndex[index2].length > 0 &&
          dataAtIndex[index2].length > chunkSize
        ) {
          let ret = dataAtIndex[index2].splice(start, chunkSize);
          await this.indexToCollections(index, ret, false);
          x++;
        }
        await this.indexToCollections(index, dataAtIndex[index2], last);
      }
    }
    this.date2 = new Date();
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
    index,
    dataAtIndex: Array<object>,
    last: boolean
  ) {
    try {
      const returned = await this.client
        .collections(this.obj.schema[index].name)
        .documents()
        .import(dataAtIndex);
      const failed = returned.filter((item) => item.success === false);
      if (failed.length > 0) {
        throw new Error(`└── Error Indexing Items`);
      }
      this.finalResult.push(returned);
      if (last) {
        console.log(
          `└── Successfully indexed ${dataAtIndex.length} docunents into the ${this.obj.schema[index].name} collection`
        );
      } else {
        console.log(
          `├── Successfully indexed ${dataAtIndex.length} docunents into the ${this.obj.schema[index].name} collection`
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
  public async createCollection() {
    try {
      await this.client.collections().create(this.schemasObj.forumSchema);
    } catch (error) {
      console.log(error);
    }
  }
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
  public schemaList() {
    console.log(`
    {
      ${JSON.stringify(this.schemasObj, null, "   ")},
    }
    `);
  }
  /**
   * Interprits the provided arrays of stings and ties them to the instancs of the class
   * will throw an error if the provided shemas and data sets dont match properties of the class.
   * @param schemaArray passed trought from .indexData()
   * @param dataArray passed through from .indexData()
   */
  private processInput(schemaArray, dataArray) {
    for (let items of schemaArray) {
      if (this.schemasObj[items]) {
        this.schemaArray.push(this.schemasObj[items]);
      } else {
        throw new Error(`${items} is not a predefined schema!!!`);
      }
    }
    for (let items of dataArray) {
      let length = items.length;
      let arrayy = [];
      for (let i = 0; i < length; i++) {
        if (this[items[i]]) {
          arrayy.push(this[items[i]]);
        } else {
          throw new Error(`Unknown data set!!!`);
        }
      }
      this.dataArray.push(arrayy);
    }
  }
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
}
