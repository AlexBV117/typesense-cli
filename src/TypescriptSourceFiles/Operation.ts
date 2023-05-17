("use strict");
export default class Operation {
  /**
   * Generates an array of length 2 from a string that maps a know word to a set of data
   * @param kvp String that needs to be split into a kvp
   * @returns Null if the sting doesn't match the regex or an array where the first item is the key and the second item is the value
   */
  public static generateKVP(kvp: string): Array<string> | null {
    const kvpRegex = /^[^=]*=[^=]*$/gm;
    if (typeof kvp.match(kvpRegex) !== null) {
      const result_array = kvp
        .split("=")
        .filter((elem) => elem)
        .slice(0, 2);
      if (result_array.length != 2) {
        return null;
      } else return result_array;
    } else {
      return null;
    }
  }
}
