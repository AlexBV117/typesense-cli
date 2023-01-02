"Use Strict"

/**
 * Import Interfaces Here:
 */
import Collection_Token from '@Interfaces/Collections.interface';
import Help_Token from '@Interfaces/Help.interface';
import Index_Token from '@Interfaces/Index.interface';
import Keys_Token from '@Interfaces/Keys.interface';
import Schemas_Token from '@Interfaces/Schemas.interface';
import Server_Token from '@Interfaces/Server.interface';
import Version_Token from '@Interfaces/Version.interface';


// Parser Class that generates defined tokens for every passed flag from the command line
export default class Parser {
    private tokens: Array<any> = [];
    public getTokens(): Array<any>{
        return this.tokens;
    };
    private args: string[];
    
    /**
     * An object containing all the functions for processing the command line arguments as tokens
     */
    private commands = {
        index : {
            regex : /^(index)$|^(i)$/gm,
            function : function(peram: string[], parser: Parser, _token?: Index_Token) {
                const filePathRegex: RegExp = /(?:(?:\/|\.\/|\.\.\/)[^\/\\]+)+(?:\.json)/gm;
                const ObjRegex: RegExp = /{.*}/gm;
                const ArrayRegex: RegExp = /\[[^\[\]]*,?\]/gm
                try {
                    let token: Index_Token;
                    if(typeof _token === 'undefined'){
                        token = {
                            name: "index",
                            data: {
                                append: false,
                                collection: "",
                                data_files: [],
                                data_raw: []
                            }
                        }
                    } else {
                        token = _token
                    }
                    // The first argument for the index flag is the collection
                    token.data.collection = peram[0];
                    // iterate over the remaining args
                    for(let i = (peram.length - 1); i > 0; i--){
                        if(peram[i].match(filePathRegex)){                     // add the file paths to the correct array
                            token.data.data_files.push(peram[i]);
                        }else if(peram[i].match(ObjRegex)){                    // add objects to the raw data array
                            if(peram[i].match(ArrayRegex)){
                                let tmp = peram[i].replace(/}[\s]?,[\s]?{/gm, "}<comma>{").replace(/\"\[|\]\"/g,'');
                                token.data.data_raw = token.data.data_raw.concat(tmp.split("<comma>"))
                            } else {
                                token.data.data_raw.push(peram[i])
                            }
                        } else { // throw an error if an argument doesn't match the two supported data types
                            throw `Data Reference Error: ${peram[i]} is an invalid argument. Expected a valid file path or a JSON object(s).`
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
                let token: Index_Token = {
                    name: "index",
                    data: {
                        append: true,
                        collection: "",
                        data_files: [],
                        data_raw: []
                    }
                }
                return parser.commands.index.function(peram, parser, token);
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
                    token.data.name = token.data.name.concat(peram)
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
                            id: -1,
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
                    if(token.data.new === true && token.data.remove === true){
                        throw "Inconsistency Error: Both \"new\" and \"remove\" keywords have been passed"
                    }
                    for(let i = peram.length-1; i >= 0; i--){
                        let kvp = parser.generateKVP(peram[i]);
                        if(kvp !== null){
                            switch(kvp[0]){
                                case "actions": {
                                    token.data.actions =  token.data.actions.concat(kvp[1].replace(/\"\[|\]\"/g,'').replace(" ","").split(','));
                                    break;
                                }
                                case "collections": {
                                    token.data.collections = token.data.collections.concat(kvp[1].replace(/\"\[|\]\"/g,'').replace(" ","").split(','));
                                    break;
                                }
                                case "description": {
                                    token.data.description = kvp[1].replace(/\"/g, "");
                                    break;
                                }
                                case "value": {
                                    token.data.value = kvp[1].replace(/\"/g, "");
                                    break;
                                }
                                case "expiresAt": {
                                    token.data.expiresAt = kvp[1].replace(/\"/g, "");
                                    break;
                                }
                                case "id": {
                                    const num = Number(kvp[1].replace(/\"/g, ""))
                                    if(isNaN(num)){
                                        throw "Type Error: id provided is not a valid number"
                                    } else
                                    token.data.id = Number(kvp[1].replace(/\"/g, ""))
                                    break;
                                }
                                default: {
                                    throw `Undefined Argument Error: \"${kvp}\" is not a supported value for key data`
                                }
                            }
                        }
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
                            path: ""
                        }
                    }
                    const tmp = __dirname.match(/^(\/.*\/typesense-cli)/gm)
                    if(tmp !== null){
                        let path = tmp[0]
                        token.data.path = path + "/config/help.txt"
                    } else {
                        throw "Unresolved Path Error: unable to generate the path to the help.txt file"
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
     * Parser Constructor that takes the command line args and then generates the relevant tokens
     * @param args The command line arguments from the process
     */
    constructor(args: string[]) {
        // Isolate the user generated augments and concatenate them to a single string
        let argumentString: string = args.slice(2,args.length).join("|").trim();
        // Create an array of strings where each string contains the process and its associated data/parameters
        this.args = argumentString.split(/(?<![^\|\n])-{1,2}/gs).filter(elem => {
            if(elem != "" && ! elem.match(/^\|*$/)){
                return elem;
            }});
        // Loop over the parameters
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
        console.log(this.tokens[0])
    }

    private generateKVP(kvp: string): Array<string> | null {
        const kvpRegex = /[^=]*=[^=]*/gm
        if(typeof kvp.match(kvpRegex) !== null){
            let result_array = kvp.split('=').filter(elem => elem).slice(0,2)
            return result_array
        }
        else{
            return null
        }
    }
}