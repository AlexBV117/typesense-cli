import RunTime from "./RunTime";
import IndexDocuments from "./modules/IndexDocuments";
import Collection from "./modules/Collections";
import Schemas from "./modules/Schemas";
import Version from "./modules/Version";
import Parser from "./modules/Parser";
import Server from "./modules/Server";
import Help from "./modules/Help";
import Key from "./modules/Key";
const settings = RunTime.getInstance();
let start_time;
let finish_time;
export async function run(args) {
    start_time = new Date();
    if (settings.getConfig().displayTitle) {
        console.log(settings.getTitle());
    }
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    try {
        for (let token of tokens) {
            let handler = new token.constructor(token, settings);
            await handler.processToken();
        }
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
    finish_time = new Date();
    console.log(timeTaken());
}
async function processToken(token) {
    switch (token.name) {
        case "index": {
            const indexDocuments = new IndexDocuments(token, settings);
            await indexDocuments.processToken().then((data) => { }, (error) => {
                console.error(error);
            });
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
