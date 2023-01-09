"Use Strict";
import Operation from "./Operation";
export default class Help extends Operation {
    constructor(token, home) {
        super(home);
    }
    static parse(args) {
        try {
            const token = {
                name: "help",
                data: {
                    path: ""
                }
            };
            const tmp = __dirname.match(/^(\/.*\/typesense-cli)/gm);
            if (tmp !== null) {
                let path = tmp[0];
                token.data.path = path + "/config/help.txt";
            }
            else {
                throw "Unresolved Path Error: unable to generate the path to the help.txt file";
            }
            return token;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
}
