import Collection from "../modules/Collections";

export default interface Collection_Token {
  constructor: typeof Collection.prototype.constructor;
  data: {
    name: string[];
    new: boolean;
    remove: boolean;
  };
}
