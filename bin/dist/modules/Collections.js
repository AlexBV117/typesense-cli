export default class Collection {
    constructor(token, home) { }
    static parse(args) {
        try {
            const token = {
                constructor: Collection.prototype.constructor,
                data: {
                    name: [],
                    new: false,
                    remove: false,
                },
            };
            if (args.includes("new")) {
                token.data.new = true;
                const index = args.lastIndexOf("new");
                args.splice(index, 1);
            }
            if (args.includes("remove")) {
                token.data.remove = true;
                const index = args.lastIndexOf("remove");
                args.splice(index, 1);
            }
            if (token.data.new && token.data.remove) {
                throw 'Inconsistency Error: Both "new" and "remove" keywords have been passed';
            }
            token.data.name = token.data.name.concat(args);
            return token;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
}
