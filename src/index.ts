import RunTime from "./RunTime";
import Parser from "./modules/Parser";

// Get the persistent run time variables and user configuration
const runtime = RunTime.getInstance();

export async function run(args: any) {
  // Display the typesense cli title
  if (runtime.settings.getConfig().displayTitle) {
    runtime.logger.log(runtime.settings.getTitle());
  }
  //***********************//
  //   Main Process Time   //
  //***********************//
  const parser = new Parser(args);
  const tokens = parser.getTokens();
  for (let i in tokens) {
    console.log(tokens[i]);
  }
  // try {
  //   // Loop over all the tokens created by the parser and execute the desired logic
  //   for (let token of tokens) {
  //     let handler = new token.constructor(token);
  //     await handler.processToken();
  //   }
  // } catch (error) {
  //   runtime.logger.error(error);
  //   process.exit(1);
  // }
}
