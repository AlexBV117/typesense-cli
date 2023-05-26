/**
 * Defines the collection object returned by the server
 */
export interface collection {
  name: string;
  fields: Array<{ name: string; type: string }>;
  num_documents: number;
  default_sorting_field: string;
  symbols_to_index: Array<string>;
  token_separators: Array<string>;
  created_at: number;
}
/**
 * Defines the response from the server form indexed documents
 */
export interface response {
  success: boolean;
  error: string;
  document: string;
}
