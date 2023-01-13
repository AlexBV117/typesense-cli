"Use Strict";

import Operation from "./Operation";
import Version_Token from "@Interfaces/Version.interface";

export default class Version extends Operation {
  constructor(token: Version_Token, home: string) {
    super(home);
  }
  public static parse(args: string[]) {
    try {
      const token: Version_Token = {
        name: "version",
        data: {},
      };
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
