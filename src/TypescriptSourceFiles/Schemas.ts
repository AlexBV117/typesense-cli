"Use Strict";

import Operation from "./Operation";
import Schemas_Token from "@Interfaces/Schemas.interface";

export default class Schemas extends Operation {
  constructor(token: Schemas_Token, home: string) {
    super(home);
  }
  public static parse(param: string[]) {
    try {
      const token: Schemas_Token = {
        name: "schemas",
        data: {},
      };
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
