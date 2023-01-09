"Use Strict";
import Operation from "./Operation";
export default class Server extends Operation {
    constructor(token, home) {
        super(home);
    }
    static parse(args) {
        try {
            const token = {
                name: "server",
                data: {}
            };
            return token;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
}
