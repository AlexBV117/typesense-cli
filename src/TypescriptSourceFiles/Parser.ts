"Use Strict"

import Collection_Token from './Interfaces/Collections.interface';
import Help_Token from './Interfaces/Help.interface';
import Index_Token from './Interfaces/Index.interface';
import Keys_Token from './Interfaces/Keys.interface';
import Schemas_Token from './Interfaces/Schemas.interface';
import Server_Token from './Interfaces/Server.interface';
import Version_Token from './Interfaces/Version.interface';

export default class Parser {
    private args: string[];
    private tokens: Array<any> = [];
    private commands = {
        index : {
            regex : /^(index)$|^(i)$/gm,
            function : function(peram: string[], parser: Parser) {
                try {
                    let token: Index_Token = {
                        name: "index",
                        data: {
                            append: false,
                            collection: peram[0],
                            data: []
                        }
                    }
                    if(peram.length <= 1){
                        throw "LENGTH ERROR: Not enough arguments!!!";
                    }else{
                        token.data.data = peram.slice(1, peram.length);
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
                try {
                    let token: Index_Token = {
                        name: "index",
                        data: {
                            append: true,
                            collection: peram[0],
                            data: []
                        }
                    }
                    if(peram.length <= 1){
                        throw "LENGTH ERROR: Not enough arguments!!!";
                    }else{
                        token.data.data = peram.slice(1, peram.length);
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
                        new : false, 
                        remove: false
                    }
                    if(peram[0] = "new"){token.new = true}
                    if(peram[0] = "remove"){token.remove = true}
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
                            name: []
                        },
                        remove: false
                    }
                    if(peram.includes("remove") && peram.length > 1){
                        token.remove = true
                        let index = peram.indexOf("remove");
                        peram.splice(index, 1)
                    }
                    token.data.name = peram
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
                            id: 0
                        },
                        new: false,
                        remove: false
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
        this.args = argumetString.split(/-{1,2}/).filter(elem => {
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
        console.log(this.tokens[0])
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