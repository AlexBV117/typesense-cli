"use strict";

import Keys from "typesense/lib/Typesense/Keys";

export default class Tokenizer {
    private args: String[];
    private flagsMap: Object = {
        index : "",
        Keys : ""
    }
    constructor(...args) {
        this.args = args;
    }

}
