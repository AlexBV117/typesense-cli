"Use Strict";
import { join } from "path";
import { existsSync } from "fs";
import IndexDocuments from "./IndexDocuments";
import Collection from "./Collections";
import Schemas from "./Schemas";
import Version from "./Version";
import Parser from "./Parser";
import Server from "./Server";
import Help from "./Help";
import Key from "./Key";
import fs from "fs";

// Locate the directory containing the user configuration
const _home: string = setRootDirPath();
let start_time: Date;
let finish_time: Date;

export async function run(args: any) {
  start_time = new Date();
  
  // Read and then display the typesense cli title
  const title = fs.readFileSync(_home + "/config/title.txt", "utf-8");
  console.log(title);

  //***********************//
  //   Main Process Time   //
  //***********************//
  const parser = new Parser(args);
  const tokens = await parser.getTokens();
  // Loop over all the tokens created by the parser and execute the desired logic
  for (let i = tokens.length - 1; i >= 0; i--) {
    await processToken(tokens[i]);
  }
  finish_time = new Date();
  console.log(timeTaken());
}

async function processToken(token: any) {
  switch (token.name) {
    case "index": {
      const indexDocuments = new IndexDocuments(token, _home);
      await indexDocuments.processToken().then(
        (data) => {},
        (error) => {
          console.error(error);
        }
      );
      break;
    }
    case "collection": {
      const collection = new Collection(token, _home);
      break;
    }
    case "help": {
      const help = new Help(token, _home);
      break;
    }
    case "key": {
      const key = new Key(token, _home);
      break;
    }
    case "schemas": {
      const schemas = new Schemas(token, _home);
      break;
    }
    case "server": {
      const server = new Server(token, _home);
      break;
    }
    case "version": {
      const version = new Version(token, _home);
      break;
    }
  }
}

function setRootDirPath() {
  const default_dir = join(__dirname, "..", "..")
  if(existsSync(default_dir)){
    return default_dir
  }
  console.log("Critical Error: Unable to locate the required configuration files. Ending process");
  process.exit(1);
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
