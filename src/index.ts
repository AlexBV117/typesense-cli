import RunTime from "./RunTime";
import Logger from "./Logger";
import Parser from "./modules/Parser";

interface ActiveModifiers {
  verbose: boolean;
}

export async function run(args: any) {
  console.log("hello world");
  const globalFlags = getGlobalFlags(args);
  const runtime = RunTime.getInstance();
  console.log("TEST RUNTIME: " + runtime.getHome());
  const logger = Logger.getInstance(runtime.getHome(), globalFlags.verbose);
  // Display the typesense cli title
  if (runtime.getConfig().displayTitle) {
    logger.log(runtime.getTitle());
  }
  //***********************//
  //   Main Process Time   //
  //***********************//
  const parser = new Parser(args);
  const tokens = parser.getTokens();
  try {
    // Loop over all the tokens created by the parser and execute the desired logic
    for (let token of tokens) {
      console.log(token);
      // let handler = new token.constructor(token);
      // await handler.processToken();
    }
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

function getGlobalFlags(args: Array<string>) {
  const modifiers: ActiveModifiers = {
    verbose: false,
  };
  const verboseModeRegex: RegExp = /^-[^v]*v[^v]*/gm;
  for (let i in args) {
    if (verboseModeRegex.test(args[i])) {
      modifiers.verbose = true;
    }
  }
  return modifiers;
}
