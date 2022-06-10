"Use Strict";
import Tokenizer from "./Tokenizer";
export async function run(args) {
    let tokens = new Tokenizer(args);
    tokens.printArgs();
    
}