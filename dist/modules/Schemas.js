import Operation from "./Operation";
export default class Schemas extends Operation {
    constructor(token, settings) {
        super();
    }
    static parse(param) {
        try {
            const token = {
                constructor: Schemas.prototype.constructor,
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
