"use strict";

interface EnvironmentVariables {
    help : boolean,
    index : {
        index : boolean,
        append : boolean,
        collections: String[],
        data : String[][]
    },
    schemas : boolean,
    version : boolean,
    server : boolean,
    collections : {
        remove : boolean,
        name : String[]
    },
    keys :  {
        new : boolean,
        remove : boolean,
        actions : String[],
        collections : String[],
        description : String,
        value : null,
        expiresAt : String,
        id : number
    },   
}

export default class Tokenizer {
    public index: number = 0;
    public args: String[];
    public flagsMap: EnvironmentVariables = {
        help : false,
        index : {
            index : false,
            append : false,
            collections: [],
            data : []
        },
        schemas : false,
        version : false,
        server : false,
        collections : {
            remove : false,
            name : []
        },
        keys :  {
            new : false,
            remove : false,
            actions : [],
            collections : [],
            description : "",
            value : null,
            expiresAt : "",
            id : 0
        },   
    };

    public commands = {
        index : {
            regex : /^(--index)$|^(-i)$/gm,
            function : function (that: Tokenizer) {
                that.flagsMap.index.index = true;
                that.formatIndexFlag();
            }
        },
        append :{
            regex : /^(--append)$|^(-a)$/gm,
            function : function (that: Tokenizer) {
                that.flagsMap.index.append = true;
                that.flagsMap.index.index = true;
                that.formatIndexFlag();
            }
        },
        schemas :{
            regex : /^(--schemas)$|^(-s)$/gm,
            function : function (that: Tokenizer) {
                console.log("l")
            }
        },
        version :{
            regex : /^(--version)$|^(-v)$/gm,
            function : function (that: Tokenizer) {
                console.log("o")
            }
        },
        server :{
            regex : /^(--server)$/gm,
            function : function (that: Tokenizer) {
                console.log("w")
            }
        },
        collections :{
            regex : /^(--collections)$|^(-c)$/gm,
            function : function (that: Tokenizer) {
                console.log("r")
            }
        },
        key :{
            regex : /^(--key)$|^(-k)$/gm,
            function : function (that: Tokenizer) {
                that.formatKeyFlag();
            }
        },
        // new :{
        //     regex : /^(--new)$|^(-n)$/gm,
        //     function : function (that: Tokenizer) {
        //         that.flagsMap.keys.new = true;
        //         that.formatKeyFlag();
        //     }
        // },
        // remove :{
        //     regex : /^(--remove)$|^(-r)$/gm,
        //     function : function (that: Tokenizer) {
        //         that.flagsMap.collections.remove = true;
        //         that.flagsMap.keys.remove = true;
        //     }
        // },
    };

    constructor(args: String[]) {
        let isFlagRegex = /-{1,2}[a-zA-Z]+/gm;
        this.args = args.splice(2,args.length);
        for(this.index = 0; this.index < this.args.length; this.index++){
            if(this.args[this.index].match(isFlagRegex)){
                this.processFlag(this.args[this.index]);
            }
        }
        console.log(this.flagsMap);
    }

    public processFlag(currentArgument: String){
        for(let command in this.commands){
            if(currentArgument.match(this.commands[command].regex)){
                this.index++;
                this.commands[command].function(this);
            };
        }
    }

    public formatIndexFlag(){
        
        let isCollection = /c:.+:.+,?/gm;
        let getNames = /c:(.+):(.+),?/gm;
        let results: RegExpExecArray | null;
        let collectionName: String;
        let collectionData: String[];
        
        for(;this.index < this.args.length; this.index++){
            if(this.args[this.index].match(isCollection)){
                results = getNames.exec(this.args[this.index].normalize());
                if( results == null) return;
                getNames.lastIndex = 0;
                collectionName = results[1];
                collectionData = results[2].split(',');
                this.flagsMap.index.collections.push(collectionName);   
                this.flagsMap.index.data.push(collectionData);
            } else {
                console.error(`ERROR: unknown argument structure: ${this.args[this.index]}`)
                this.index--;
                return;
            }
        }
    }

    public formatKeyFlag(){
        let keyValuePairRegex = /.+:.+/gm;
        for(;this.index < this.args.length; this.index++){
            let keyValuePair = this.args[this.index];
            if(!keyValuePair.match(keyValuePairRegex)) {
                console.error(`ERROR: ${keyValuePair} is not a valid key value pair`)
                continue;
            }
            let keyValuePairArray: String[] = keyValuePair.split(':');
            let key: String = keyValuePairArray[0];
            let value: String = keyValuePairArray[1];
            for(let property in this.flagsMap.keys){
                if(key == property){
                    this.flagsMap.keys[property] = value;
                }
            }
        }
    }
}
