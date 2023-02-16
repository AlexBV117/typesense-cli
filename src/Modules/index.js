"Use Strict";
import IndexDocuments from "./IndexDocuments";
import Collection from "./Collections";
import Schemas from "./Schemas";
import Version from "./Version";
import Parser from "./Parser";
import Server from "./Server";
import Help from "./Help";
import Key from "./Key";
import fs from "fs";
let _home;
let start_time;
let finish_time;
export async function run(args) {
    start_time = new Date();
    // Locate the directory containing the user configuration
    await setRootDirPath().then((value) => {
        if (typeof value === "string") {
            _home = value;
        }
    }, () => {
        console.error("Critical Error: Unable to locate the required configuration files. Ending process");
        process.exit(1);
    });
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
async function processToken(token) {
    switch (token.name) {
        case "index": {
            const indexDocuments = new IndexDocuments(token, _home);
            await indexDocuments.processToken().then((data) => { }, (error) => {
                console.error(error);
            });
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
    return new Promise((resolve, reject) => {
        let result = "~/.typesense-cli"; // Default home path for user configuration
        try {
            // First try and resolve the full path to the users home directory
            const tmp2 = process.env.HOME;
            if (tmp2 === undefined) {
                throw "Unresolved Path Error: Unable to locate the users home directory.";
            }
            else {
                result = tmp2 + "/.typesense-cli";
                // Has the user created a configuration file / directory
                if (!fs.existsSync(result)) {
                    throw `Unresolved Path Error: ${result} doesn't exist falling back to defaults.`;
                }
            }
        }
        catch (error) {
            console.error(error);
            try {
                // If the users home directory cant be found then try and find the default config file
                const tmp1 = __dirname.match(/^(\/.*\/typesense-cli)/gm);
                if (tmp1 === null) {
                    throw "Unresolved Path Error: Unable to locate the default typesense-cli home directory.";
                }
                else {
                    result = tmp1[0];
                }
            }
            catch (error) {
                // If all else fails reject the promise.
                console.error(error);
                reject();
            }
        }
        // All is well and can return whatever has come back
        resolve(result);
    });
}
/**
 * Calculates the time difference between two date objects and generates an easily understood message for the user
 * @returns message informing of the time taken with appropriate grammar
 */
function timeTaken() {
    let time = finish_time.valueOf() - start_time.valueOf();
    let response;
    let x;
    if (time >= 60000) {
        x = time / 60000;
        response = `${x.toFixed(2)} minute${x == 1 ? "" : "s"}`;
        return response;
    }
    else {
        x = time / 1000;
        response = `${x.toFixed(2)} second${x == 1 ? "" : "s"}`;
        return response;
    }
}
