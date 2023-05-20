import Operation from "./Operation";
export default class Server extends Operation {
    constructor(token, settings) {
        super();
    }
    static parse(args) {
        try {
            const token = {
                constructor: Server.prototype.constructor,
                data: {},
            };
            return token;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
}
