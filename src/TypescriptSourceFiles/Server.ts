"Use Strict";

import Operation from "./Operation";
import Server_Token from "@Interfaces/Server.interface";

export default class Server extends Operation {
  constructor(token: Server_Token, home: string) {
    super(home);
  }
  public static parse(args: string[]) {
    try {
      const token: Server_Token = {
        name: "server",
        data: {},
      };
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
