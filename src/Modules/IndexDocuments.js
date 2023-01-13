"Use Strict";
import Operation from './Operation';
export default class IndexDocuments extends Operation {
    constructor(token, homeDir) {
        super(homeDir);
        this.token = token;
    }
    static parse(args, _append) {
        const filePathRegex = /(?:(?:\/|\.\/|\.\.\/)[^\/\\]+)+(?:\.json)/gm;
        const ObjRegex = /{.*}/gm;
        const ArrayRegex = /\[[^\[\]]*,?\]/gm;
        try {
            let token = {
                name: "index",
                data: {
                    append: false,
                    collection: "",
                    data_files: [],
                    data_raw: []
                }
            };
            if (_append === true) {
                token.data.append = true;
            }
            // The first argument for the index flag is the collection.
            token.data.collection = args[0];
            // Iterate over the remaining args.
            for (let i = (args.length - 1); i > 0; i--) {
                if (args[i].match(filePathRegex)) { // Add the file paths to the paths array.
                    token.data.data_files.push(args[i]);
                }
                else if (args[i].match(ObjRegex)) { // Add raw json objects to the data array.
                    if (args[i].match(ArrayRegex)) {
                        // This takes any array passed as a string to be appended to the raw data array (allows for rested json objects)
                        const tmp = args[i].replace(/}[\s]?,[\s]?{/gm, "}<comma>{").replace(/\"\[|\]\"/g, '');
                        token.data.data_raw = token.data.data_raw.concat(tmp.split("<comma>"));
                    }
                    else {
                        // If a single object is passed then just append it to the raw data array
                        token.data.data_raw.push(args[i]);
                    }
                }
                else {
                    // Throw an error if an argument doesn't match the two supported data types.
                    throw `Data Reference Error: ${args[i]} is an invalid argument. Expected a valid file path or a JSON object(s).`;
                }
            }
            return token;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async processToken() {
        return new Promise(async (resolve, reject) => {
            let _schema;
            if (!this.schemas.hasOwnProperty(this.token.data.collection)) {
                reject(`Collection Error: ${this.token.data.collection} is not defined in the schemas.json`);
                return;
            }
            else {
                _schema = this.schemas[this.token.data.collection];
                console.log(_schema);
            }
        });
    }
    async refreshCollections(_schema) {
        let _collection;
        _collection = await this.client.collections().retrieve();
        if (!_collection.includes(this.token.data.collection)) {
            this.client.collections().create(_schema).then(() => {
                console.log(`create <tmp>`);
            }, (error) => { console.error(error); });
        }
        else if (!this.token.data.append) {
            await this.client.collections(this.token.data.collection).delete().then(() => {
                console.log(`Delete <tmp>`);
            }, (error) => {
                console.error(error);
            });
            ;
            await this.client.collection().create(_schema).then(() => {
                console.log(`create <tmp>`);
            }, (error) => { console.error(error); });
            ;
        }
    }
}
