import Operation from "./Operation";
import Help_Token from "../interfaces/Help";
import RunTime from "../RunTime";

export default class Help extends Operation {
  constructor(token: Help_Token, settings: RunTime) {
    super();
  }
  public static parse(args: string[]) {
    try {
      const token: Help_Token = {
        constructor: Help.prototype.constructor,
        data: {},
      };
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
