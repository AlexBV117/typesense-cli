import RunTime from "./RunTime";
import Logger from "./Logger";
import Parser from "./modules/Parser";
export async function run(args) {
    console.log("hello world");
    const globalFlags = getGlobalFlags(args);
    const runtime = RunTime.getInstance();
    console.log("TEST RUNTIME: " + runtime.getHome());
    const logger = Logger.getInstance(runtime.getHome(), globalFlags.verbose);
    if (runtime.getConfig().displayTitle) {
        logger.log(runtime.getTitle());
    }
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    try {
        for (let token of tokens) {
            console.log(token);
        }
    }
    catch (error) {
        logger.error(error);
        process.exit(1);
    }
}
function getGlobalFlags(args) {
    const modifiers = {
        verbose: false,
    };
    const verboseModeRegex = /^-[^v]*v[^v]*/gm;
    for (let i in args) {
        if (verboseModeRegex.test(args[i])) {
            modifiers.verbose = true;
        }
    }
    return modifiers;
}
