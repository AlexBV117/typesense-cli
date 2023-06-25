import RunTime from "./RunTime";
import Parser from "./modules/Parser";

// Get the persistent run time variables and user configuration
const runtime = RunTime.getInstance();
let start_time: Date;
let finish_time: Date;

export async function run(args: any) {
  start_time = new Date();
  // Display the typesense cli title
  if (runtime.settings.getConfig().displayTitle) {
    console.log(runtime.settings.getTitle());
  }
  //***********************//
  //   Main Process Time   //
  //***********************//
  runtime.logger.error("Test Error");
  const parser = new Parser(args);
  const tokens = parser.getTokens();
  try {
    // Loop over all the tokens created by the parser and execute the desired logic
    for (let token of tokens) {
      let handler = new token.constructor(token, runtime);
      await handler.processToken();
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  finish_time = new Date();
  console.log(timeTaken());
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
