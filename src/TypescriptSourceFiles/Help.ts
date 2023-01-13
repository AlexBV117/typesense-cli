"Use Strict";

import Operation from "./Operation";
import Help_Token from "@Interfaces/Help.interface";

export default class Help extends Operation {
  constructor(token: Help_Token, home: string) {
    super(home);
  }
  public static parse(args: string[]) {
    try {
      const token: Help_Token = {
        name: "help",
        data: {},
      };
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
