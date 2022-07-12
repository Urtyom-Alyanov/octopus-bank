export interface IHttpFetchErrorMessage {
  errorCode: number;
  errorText: string;
}

export interface IHttpFetchError {
  statusCode: number;
  error: string;
  message: IHttpFetchErrorMessage | string;
}
