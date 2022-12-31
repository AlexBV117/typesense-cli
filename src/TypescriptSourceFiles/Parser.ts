"Use Strict"

import Collection_Token from './Interfaces/Collections.interface';
import Help_Token from './Interfaces/Help.interface';
import Index_Token from './Interfaces/Index.interface';
import Keys_Token from './Interfaces/Keys.interface';
import Schemas_Token from './Interfaces/Schemas.interface';
import Server_Token from './Interfaces/Server.interface';
import Version_Token from './Interfaces/Version.interface';

export default class Parser {
    public getTokens(): Array<any>{
        return this.tokens;
    }
    private args: string[];
    private tokens: Array<any> = [];
    /**
     * An object containg all the functions for processing the command line arguments as tokens
     */
    private commands = {
        index : {
            regex : /^(index)$|^(i)$/gm,
            function : function(peram: string[], parser: Parser) {
                const filePathRegex: RegExp = /(?:(?:\/|\.\/|\.\.\/)[^\/\\]+)+(?:\.json)/gm;
                const ObjRegex: RegExp = /({[^{]*})/gm;
                try {
                    let token: Index_Token = {
                        name: "index",
                        data: {
                            append: false,
                            collection: "",
                            data_files: [],
                            data_raw: []
                        }
                    }
                    token.data.collection = peram[0];
                    for(let i = (peram.length - 1); i > 0; i--){
                        if(peram[i].match(filePathRegex)){
                            token.data.data_files.push(peram[i]);
                        }else if(peram[i].match(ObjRegex)){
                            let tmp = peram[i].match(ObjRegex)
                            if(tmp != null){
                                token.data.data_raw = token.data.data_raw.concat(tmp)
                            }
                        } else {
                            throw `Type Error: ${peram[i]} invalid data reference. Expected a valid file path or an array of JSON objects.`
                        }
                    }
                    return token
                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        },
        append : {
            regex : /^(append)$|^(a)$/gm,
            function : function(peram: string[], parser: Parser) {
                const filePathRegex: RegExp = /(?:(?:\/|\.\/|\.\.\/)[^\/\\]+)+(?:\.json)/gm;
                const ObjRegex: RegExp = /({[^{]*})/gm;
                try {
                    let token: Index_Token = {
                        name: "index",
                        data: {
                            append: true,
                            collection: "",
                            data_files: [],
                            data_raw: []
                        }
                    }
                    token.data.collection = peram[0];
                    for(let i = (peram.length - 1); i > 0; i--){
                        if(peram[i].match(filePathRegex)){
                            token.data.data_files.push(peram[i]);
                        }else if(peram[i].match(ObjRegex)){
                            let tmp = peram[i].match(ObjRegex)
                            if(tmp != null){
                                token.data.data_raw = token.data.data_raw.concat(tmp)
                            }
                        } else {
                            throw `Type Error: ${peram[i]} invalid data reference. Expected a valid file path or an array of JSON objects.`
                        }
                    }
                    return token
                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        },
        schemas : {
            regex : /^(schemas)$|^(s)$/gm,
            function : function(peram: string[], parser: Parser) {
                try {
                    let token: Schemas_Token = {
                        name: "schemas",
                        data: {},
                    }
                    return token
                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        },
        version : {
            regex : /^(version)$|^(v)$/gm,
            function : function(peram: string[], parser: Parser) {
                try {
                    let token: Version_Token = {
                        name:  "version",
                        data: {}
                    }
                    return token
                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        },
        server : {
            regex : /^(server)$/gm,
            function : function(peram: string[], parser: Parser) {
                try {
                    let token: Server_Token = {
                        name: "server",
                        data: {}
                    }
                    return token
                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        },
        collections : {
            regex : /^(collections)$|^(c)$/gm,
            function : function(peram: string[], parser: Parser) {
                try {
                    let token: Collection_Token = {
                        name: "collection",
                        data: {
                            name: [],
                            new: false,
                            remove: false
                        },
                    }
                    if(peram.includes("new")){
                        token.data.new = true;
                        let index = peram.lastIndexOf("new");
                        peram.splice(index, 1);
                    }
                    if (peram.includes("remove")) {
                        token.data.remove = true;
                        let index = peram.lastIndexOf("remove");
                        peram.splice(index, 1);
                    }
                    if(token.data.new && token.data.remove){
                        throw "Inconsistency Error: Both \"new\" and \"remove\" keywords have been passed"
                    }
                    token.data.name.concat(peram)
                    return token
                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        },
        keys : {
            regex : /^(key)$|^(k)$/gm,
            function : function(peram: string[], parser: Parser) {
                try {
                    let token: Keys_Token = {
                        name: "key",
                        data: {
                            actions: [],
                            collections: [],
                            description: "",
                            value: "",
                            expiresAt: "",
                            id: 0,
                            new: false,
                            remove: false
                        }
                    }
                    if(peram.includes("new")){
                        token.data.new = true;
                        let index = peram.lastIndexOf("new");
                        peram.splice(index, 1);
                    }
                    if (peram.includes("remove")) {
                        token.data.remove = true;
                        let index = peram.lastIndexOf("remove");
                        peram.splice(index, 1);
                    }
                    if(token.data.new && token.data.remove){
                        throw "Inconsistency Error: Both \"new\" and \"remove\" keywords have been passed"
                    }
                    for(let i = peram.length; i > 0; i--){
                        
                    }
                    return token
                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        },
        help : {
            regex : /^(help)$|^(h)$/gm,
            function : function(peram: string[], parser: Parser) {
                try {
                    let token: Help_Token = {
                        name: "help",
                        data: {
                            path: "@Config/help.txt"
                        }
                    }
                    return token
                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        }
    };
    /**
     * 
     * @param args The command line arguments from the porcess
     */
    constructor(args: string[]) {
        // Isolate the user generated aguments and concatonate them to a single string
        let argumetString: string = args.slice(2,args.length).join("|").trim();
        // Create an array of strings where each string contains the process and its associated data/perameters
        this.args = argumetString.split(/(?<![^\|\n])-{1,2}/gs).filter(elem => {
            if(elem != "" && ! elem.match(/^\|*$/)){
                return elem;
            }});
        // Loop over the perameters
        for(let i = 0; i < this.args.length; i++){
            let _process: string[] = this.args[i].split("|").filter(elem => elem)
            for(let command in this.commands){
                if(_process[0].match(this.commands[command as keyof typeof this.commands].regex)){
                    let token = this.commands[command as keyof typeof this.commands].function(_process.slice(1, _process.length), this);
                    if(token != null){
                        this.tokens.push(token)
                    }
                };
            }
        };
    }

    private createMap(kvp: string): Array<string> | null {
        const kvpRegex = /[^=]*=[^=]*/gm
        if(kvp.match(kvpRegex)){
            let result_array = kvp.split('=').filter(elem => elem).slice(0,2)
            return result_array
        }
        else{
            return null
        }
    }
}