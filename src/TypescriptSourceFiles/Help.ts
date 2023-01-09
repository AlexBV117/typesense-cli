"Use Strict";

import Operation from "./Operation";
import Help_Token from "@Interfaces/Help.interface";

export default class Help extends Operation{
    constructor(token: Help_Token,  home: string){
        super(home)
    }
    public static parse(args: string[]){
        try {
            const token: Help_Token = {
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
            return token;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}