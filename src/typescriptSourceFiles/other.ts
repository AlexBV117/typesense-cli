"use strict";
const typesense = require("typesense");
const fs = require("fs");

export class application {
  private h = process.env.HOME;
  private node = require(this.h + "/.typesense-cli/typesense-cli.config.json");
  private schemas = require(this.h + "/.typesense-cli/schemas.json");
  private client = new typesense.Client(this.node.serverNode);

  public async collections() {
    let collections = await this.client.collections().retrieve();
    console.log(collections);
  }

  public async deleteCollection(args: string) {
    let collections = args.split(" ");
    for (let collection of collections) {
      try {
        this.client.collections(collection).delete();
        console.log(collection + " deleted");
      } catch (error) {
        console.log(error);
      }
    }
  }

  public async makeKey(x) {
    let json = JSON.parse(x);
    try {
      let newKey = await this.client.keys().create({
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
    let key = await this.client.keys().retrieve();
    console.log(JSON.stringify(key, null, "  "));
  }

  public removeKey(arg: string) {
    let id = arg.split(" ");
    for (let ids of id) {
      this.client.keys(ids).delete();
      console.log(`key: ${ids} deleted`);
    }
  }

  public getSchemas() {
    console.log(JSON.stringify(this.schemas, null, "  "));
  }

  public version() {
    let pack = require("../../package.json");
    console.log(`Version: ${pack.version}`);
  }

  public async help() {
    fs.readFile("../../help.txt", "utf8", (err, data) => {
      if (err) throw err;
      console.log(data);
    });
  }
}
