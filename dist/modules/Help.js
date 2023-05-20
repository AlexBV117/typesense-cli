import Operation from "./Operation";
export default class Help extends Operation {
    constructor(token, settings) {
        super();
    }
    static parse(args) {
        try {
            const token = {
                constructor: Help.prototype.constructor,
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
