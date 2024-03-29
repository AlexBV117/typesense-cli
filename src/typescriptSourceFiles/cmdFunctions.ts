"use strict";
const typesense = require("typesense");
const file = require("./dirs");
const fs = require("fs");
const h = process.env.HOME;
const node = require(h + "/.typesense-cli/typesense-cli.config.json");
const schemas = require(h + "/.typesense-cli/schemas.json");
const client = new typesense.Client(node.serverNode);

export class index {
  private start_time: any;
  private finish_time: any;
  private json: any;
  private collection: any;
  private finalResult = [];

  public async appendData(p) {
    this.json = JSON.parse(p);
    await this.getCol();
    this.start_time = new Date();
    console.log("Appending Data...\n");
    this.inputValidation();
    await this.chunkData();
    let results =  await Promise.all(this.finalResult);
    this.finish_time = new Date();
    console.log(
      `\nFinished Appendind data ${this.getNumberOfIndexed(
        this.finalResult
      ).toString()} documents into memory in ${this.timeTaken()}`
    );
    return results;
  }

  public async indexData(p) {
    this.json = JSON.parse(p);
    await this.getCol();
    this.start_time = new Date();
    console.log("Staring Index...\n");
    this.inputValidation();
    await this.refreshSchemas();
    await this.chunkData();
    let results = await Promise.all(this.finalResult);
    this.finish_time = new Date();
    console.log(
      `\nFinished indexing ${this.getNumberOfIndexed(
        this.finalResult
      ).toString()} documents into memory in ${this.timeTaken()}`
    );
    return results;
  }

  private inputValidation() {
    if (this.schemasExist()) {
      this.dataExists();
    }
  }

  private schemasExist() {
    for (let i = 0; i < this.json.length; i++) {
      if (!schemas[this.json[i].collection]) {
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

  private async refreshSchemas() {
    if (this.json.length === undefined) {
      throw new Error("Expected args for --index are [string]");
    }
    for (let i = 0; i < this.json.length; i++) {
      if (this.alreadyACollection(i)) {
        console.log(`Refreshing ${this.json[i].collection} collection:`);
        try {
          await client.collections(this.json[i].collection).delete();
          console.log(`├── Old ${this.json[i].collection} collection deleted`);
          await client.collections().create(schemas[this.json[i].collection]);
          console.log(`└── New ${this.json[i].collection} collection created`);
        } catch {
          (error) => {
            console.log(error);
          };
        }
      } else {
        console.log(`Creating the ${this.json[i].collection} collection:`);
        try {
          await client.collections().create(schemas[this.json[i].collection]);
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
    this.collection = await client.collections().retrieve();
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
        let chunkSize = node.chunckSize;
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
    let time = this.finish_time - this.start_time;
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

  private async indexToCollections(
    i,
    dataAtIndex: Array<object>,
    last: boolean
  ) {
    try {
      const returned = await client
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

  private getNumberOfIndexed(indexedData: Array<any>) {
    let dataSet = indexedData.length;
    let count = 0;
    for (let i = 0; i < dataSet; i++) {
      let setLength = indexedData[i].length;
      count += setLength;
    }
    return count;
  }
}

export class other {
  public async collections() {
    let collections = await client.collections().retrieve();
    console.log(collections);
  }

  public async deleteCollection(args: string) {
    let collections = args.split(" ");
    for (let collection of collections) {
      try {
        client.collections(collection).delete();
        console.log(collection + " deleted");
      } catch (error) {
        console.log(error);
      }
    }
  }

  public async makeKey(x) {
    let json = JSON.parse(x);
    try {
      let newKey = await client.keys().create({
        description: json.description,
        actions: json.actions,
        collections: json.collections,
      });
      console.log(newKey);
    } catch (error) {
      console.log(error);
    }
  }

  public async getKeys() {
    let key = await client.keys().retrieve();
    console.log(JSON.stringify(key, null, "  "));
  }

  public removeKey(arg: string) {
    let id = arg.split(" ");
    for (let ids of id) {
      client.keys(ids).delete();
      console.log(`key: ${ids} deleted`);
    }
  }

  public getSchemas() {
    console.log(JSON.stringify(schemas, null, "  "));
  }

  public version() {
    let pack = require("../../package.json");
    console.log(`Version: ${pack.version}`);
  }

  public async help() {
    fs.readFile(h + "/.typesense-cli/help.txt", "utf8", (err, data) => {
      if (err) throw err;
      console.log(data);
    });
  }
}
