"Use Strict";
import Operation from "./Operation";
export default class Version extends Operation {
    constructor(token, home) {
        super(home);
    }
    static parse(args) {
        try {
            const token = {
                name: "version",
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
;
