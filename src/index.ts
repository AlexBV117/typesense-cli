import RunTime from "./RunTime";
import metaData from "./interfaces/metaData";

import IndexDocuments from "./modules/IndexDocuments";
import Collection from "./modules/Collections";
import Schemas from "./modules/Schemas";
import Version from "./modules/Version";
import Parser from "./modules/Parser";
import Server from "./modules/Server";
import Help from "./modules/Help";
import Key from "./modules/Key";

// Get the persistent run time variables and user configuration
const settings = RunTime.getInstance();
let start_time: Date;
let finish_time: Date;

export async function run(args: any) {
  start_time = new Date();
  // Display the typesense cli title
  if (settings.getConfig().displayTitle) {
    console.log(settings.getTitle());
  }
  //***********************//
  //   Main Process Time   //
  //***********************//
  const parser = new Parser(args);
  const tokens = parser.getTokens();
  try {
    // Loop over all the tokens created by the parser and execute the desired logic
    for (let token of tokens) {
      let handler = new token.constructor(token, settings);
      await handler.processToken();
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  finish_time = new Date();
  console.log(timeTaken());
}

async function processToken(token: any) {
  switch (token.name) {
    case "index": {
      const indexDocuments = new IndexDocuments(token, settings);
      await indexDocuments.processToken().then(
        (data) => {},
        (error) => {
          console.error(error);
        }
      );
      break;
    }
    case "collection": {
      const collection = new Collection(token, settings);
      break;
    }
    case "help": {
      const help = new Help(token, settings);
      break;
    }
    case "key": {
      const key = new Key(token, settings);
      break;
    }
    case "schemas": {
      const schemas = new Schemas(token, settings);
      break;
    }
    case "server": {
      const server = new Server(token, settings);
      break;
    }
    case "version": {
      const version = new Version(token, settings);
      break;
    }
  }
}

/**
 * Calculates the time difference between two date objects and generates an easily understood message for the user
 * @returns message informing of the time taken with appropriate grammar
 */
function timeTaken() {
  let time = finish_time.valueOf() - start_time.valueOf();
  let response: string;
  let x: Number;
  if (time >= 60000) {
    x = time / 60000;
    response = `${x.toFixed(2)} minute${x == 1 ? "" : "s"}`;
    return response;
  } else {
    x = time / 1000;
    response = `${x.toFixed(2)} second${x == 1 ? "" : "s"}`;
    return response;
  }
}
