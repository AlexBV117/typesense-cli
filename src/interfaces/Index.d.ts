import IndexDocuments from "../modules/Index";
export default interface Index_Token {
  constructor: typeof IndexDocuments.prototype.constructor;
  data: {
    append: boolean;
    collection: string;
    data_files: string[];
    data_raw: Array<Object>;
  };
}
