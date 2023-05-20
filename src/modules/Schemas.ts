import Operation from "./Operation";
import Schemas_Token from "../interfaces/Schemas.interface";
import RunTime from "../RunTime";

export default class Schemas extends Operation {
  constructor(token: Schemas_Token, settings: RunTime) {
    super();
  }
  public static parse(param: string[]) {
    try {
      const token: Schemas_Token = {
        constructor: Schemas.prototype.constructor,
        data: {},
      };
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
