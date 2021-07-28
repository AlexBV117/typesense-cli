"use strict";
const typesense = require("typesense");
const file = require("./dirs");

export class application {
  private h = process.env.HOME;
  private node = require(this.h + "/.typesense-cli/typesense-cli.config.json");
  private schemas = require(this.h + "/.typesense-cli/schemas.json");
  private client = new typesense.Client(this.node.serverNode);
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

  public getSchemas() {
    console.log(JSON.stringify(this.schemas, null, "  "));
  }
}
