import RunTime from "./RunTime";
import Parser from "./modules/Parser";
const runtime = RunTime.getInstance();
let start_time;
let finish_time;
export async function run(args) {
    start_time = new Date();
    if (runtime.settings.getConfig().displayTitle) {
        console.log(runtime.settings.getTitle());
    }
    runtime.logger.error("Test Error");
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    try {
        for (let token of tokens) {
            let handler = new token.constructor(token, runtime);
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
