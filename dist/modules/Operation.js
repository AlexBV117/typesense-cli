export default class Operation {
    static generateKVP(kvp) {
        const kvpRegex = /^[^=]*=[^=]*$/gm;
        if (typeof kvp.match(kvpRegex) !== null) {
            const result_array = kvp
                .split("=")
                .filter((elem) => elem)
                .slice(0, 2);
            if (result_array.length != 2) {
                return null;
            }
            else
                return result_array;
        }
        else {
            return null;
        }
    }
}
