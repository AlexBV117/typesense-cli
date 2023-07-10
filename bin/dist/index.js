import RunTime from "./RunTime";
import Parser from "./modules/Parser";
const runtime = RunTime.getInstance();
export async function run(args) {
    if (runtime.settings.getConfig().displayTitle) {
        runtime.logger.log(runtime.settings.getTitle());
    }
    const parser = new Parser(args);
    const tokens = parser.getTokens();
    for (let i in tokens) {
        console.log(tokens[i]);
    }
}
