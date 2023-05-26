import Operation from "./Operation";
import Version_Token from "../interfaces/Version";
import RunTime from "../RunTime";

export default class Version extends Operation {
  constructor(token: Version_Token, settings: RunTime) {
    super();
  }
  public static parse(args: string[]) {
    try {
      const token: Version_Token = {
        constructor: Version.prototype.constructor,
        data: {},
      };
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
