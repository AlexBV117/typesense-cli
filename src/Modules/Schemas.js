"Use Strict";
import Operation from "./Operation";
export default class Schemas extends Operation {
    constructor(token, home) {
        super(home);
    }
    static parse(param) {
        try {
            const token = {
                name: "schemas",
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
