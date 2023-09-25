import IndexDocuments from "../modules/Index";
export default interface Index_Token {
  constructor: typeof IndexDocuments.prototype.constructor;
  modifiers: {
    append: boolean;
    upsert: boolean;
    update: boolean;
    emplace: boolean;
  };
  data: {
    collection: string;
    data_files: string[];
    data_raw: Array<Object>;
  };
}
