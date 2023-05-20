import Key from "../modules/Key";

export default interface Keys_Token {
  constructor: typeof Key.prototype.constructor;
  data: {
    actions: string[];
    collections: string[];
    description: string;
    value: string;
    expiresAt: string;
    id: number;
    new: boolean;
    remove: boolean;
  };
}
