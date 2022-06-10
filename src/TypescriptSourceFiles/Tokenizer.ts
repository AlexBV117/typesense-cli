"use strict";
export default class Tokenizer {
    private args: String[];
    private flagsMap: Object = {
        help : "",
        index : "",
        append : "",
        schemas : "",
        version : "",
        server : "",
        collections : "",
        keys : "",
        new : "",
        remove : ""   
    }
    constructor(...args) {
        this.args = args;
    }

    printArgs(){
        console.log(this.args)
        return this.flagsMap;
    }
}
