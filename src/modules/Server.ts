import Operation from "./Operation";
import Server_Token from "../interfaces/Server.interface";
import RunTime from "../RunTime";

export default class Server extends Operation {
  constructor(token: Server_Token, settings: RunTime) {
    super();
  }
  public static parse(args: string[]) {
    try {
      const token: Server_Token = {
        constructor: Server.prototype.constructor,
        data: {},
      };
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
