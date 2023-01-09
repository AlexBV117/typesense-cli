"Use Strict";

import Parser from "./Parser";
import IndexDocuments from './IndexDocuments';
import fs from "fs";

let _home: string;
let start_time: Date;
let finish_time: Date;

async function run(args: any) {
    start_time = new Date();
    await setRootDirPath().then(
    (value) => {
        if(typeof value === "string"){
            _home = value;
        }
    },
    (err) => {
        console.log(err);
        process.exit(1);
    });
    const parser = new Parser(args);
    const tokens = await parser.getTokens();
    tokens.forEach((token) => {
        processToken(token);
    });
    finish_time = new Date();
    console.log(timeTaken());
}

function processToken(token: any){
    switch(token.name){
        case "index": {
            const index = new IndexDocuments(token, _home);
            console.log("index")
            break;
        }
        case "collection": {
            console.log("collection");
            break;
        }
        case "help": {
            console.log("help");
            break;
        }
        case "key": {
            console.log("key");
            break;
        }
        case "schemas": {
            console.log("schemas");
            break;
        }
        case "server": {
            console.log("server");
            break;
        }
        case "version": {
            console.log("version");
            break;
        }
    }
}

function setRootDirPath(){
    return new Promise((resolve, reject) => {
        let result: string = "";
        try {
            const tmp2 = process.env.HOME;
            if(tmp2 === undefined){
                throw "Unresolved Path Error: unable to generate definitive path to the user home directory";
            } else {
                result = tmp2 + "/.typesense-cli"
                if(! fs.existsSync(result)){
                    throw `Unresolved Path Error: ${result} doesn't exist falling back to defaults`;
                }
            }
        } catch (error) {
            console.error(error);
            try {
                const tmp1 = __dirname.match(/^(\/.*\/typesense-cli)/gm);
                if(tmp1 === null){
                    throw "Unresolved Path Error: unable to generate definitive path to the typesense-cli dir";
                } else {
                    result = tmp1[0];
                }
            } catch (error) {
                console.error(error);
                reject()
            }
        }
        resolve(result);
    });
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
      response = `${x.toFixed(2)} minute${(x==1)? "" : "s"}`;
      return response;
    } else {
      x = time / 1000;
      response = `${x.toFixed(2)} second${(x==1)? "" : "s"}`;
      return response;
    }
  }