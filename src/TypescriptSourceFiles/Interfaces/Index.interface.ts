export default interface Index_Token {
  name: "index";
  data: {
    append: boolean;
    collection: string;
    data_files: string[];
    data_raw: Array<Object>;
  };
}
