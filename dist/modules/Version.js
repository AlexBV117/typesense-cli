import Operation from "./Operation";
export default class Version extends Operation {
    constructor(token, settings) {
        super();
    }
    static parse(args) {
        try {
            const token = {
                constructor: Version.prototype.constructor,
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
