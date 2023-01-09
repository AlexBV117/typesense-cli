"Use Strict"
import  Operation  from './Operation' 
import Index_Token from '@Interfaces/Index.interface';

export default class IndexDocuments extends Operation {
    constructor(token: Index_Token, home: string){
        super(home)
    }
    public static parse(args: string[], _append?: boolean){
        const filePathRegex: RegExp = /(?:(?:\/|\.\/|\.\.\/)[^\/\\]+)+(?:\.json)/gm;
        const ObjRegex: RegExp = /{.*}/gm;
        const ArrayRegex: RegExp = /\[[^\[\]]*,?\]/gm;
        try {
            let token: Index_Token= {
                name: "index",
                data: {
                    append: false,
                    collection: "",
                    data_files: [],
                    data_raw: []
                }
            }
            if(_append === true){
                token.data.append = true;
            }
            // The first argument for the index flag is the collection.
            token.data.collection = args[0];
            // Iterate over the remaining args.
            for(let i = (args.length - 1); i > 0; i--){
                if(args[i].match(filePathRegex)){                     // Add the file paths to the paths array.
                    token.data.data_files.push(args[i]);
                }else if(args[i].match(ObjRegex)){                    // Add raw json objects to the data array.
                    if(args[i].match(ArrayRegex)){
                        // This takes any array passed as a string to be appended to the raw data array (allows for rested json objects)
                        const tmp = args[i].replace(/}[\s]?,[\s]?{/gm, "}<comma>{").replace(/\"\[|\]\"/g,'');
                        token.data.data_raw = token.data.data_raw.concat(tmp.split("<comma>"));
                    } else {
                        // If a single object is passed then just append it to the raw data array
                        token.data.data_raw.push(args[i]);
                    }
                } else { 
                    // Throw an error if an argument doesn't match the two supported data types.
                    throw `Data Reference Error: ${args[i]} is an invalid argument. Expected a valid file path or a JSON object(s).`
                }
            }
            return token;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}