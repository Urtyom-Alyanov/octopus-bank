export interface IOAuthQueryData {
  scopes: string[];
  client_id: number;
  response_type: 'code' | 'token';
  redirect_uri: string;
  state?: string;
}
