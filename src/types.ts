// Util

type TPath = `/${string}`;

type TJsonObj = Record<string, any>;

// Options

/**
 * @description
 * APIOptions are defined so as to unify the different http methods under one method in APIClient, #apiCall().
 */
interface IAPIOptions {
  path?: TPath;
  query?: Record<string, string>;
  method: "get" | "post" | "put" | "delete";
  headers?: Headers;
  body?: TJsonObj;
  credentials?: RequestInit["credentials"];
}

type TAPIPubOptions = Omit<IAPIOptions, "method" | "body">;

type TNoBodyAPIOptions = TAPIPubOptions;

interface IBodyAPIOptions extends TAPIPubOptions {
  body: TJsonObj;
}

type TGetOptions = TNoBodyAPIOptions;

type TPostOptions = IBodyAPIOptions;

type TPutOptions = IBodyAPIOptions;

type TDeleteOptions = TNoBodyAPIOptions;

// Responses

interface IOkResponse<T> {
  code: 200;
  name: "ok";
  data: T;
}

interface ICreatedResponse<T> {
  code: 201;
  name: "created";
  data: T;
}

interface IBadResponse {
  code: 400;
  name: "bad request";
}

interface IUnauthorizedResponse {
  code: 401;
  name: "unauthorized";
}

interface INotFoundResponse {
  code: 404;
  name: "not found";
}

interface IServerErrorResponse {
  code: 500;
  name: "server error";
}

/**
 * @description
 * IUnKnownResponse is used for response types not supported by this library.
 */
interface IUnknownResponse {
  /**
   * @property
   * code is not the status code for IUnknownResponse, see the statusCode property. This is to allow for easy pattern matching on the code property.
   */
  code: 0;
  statusCode: number;
  name: "unknown";
}

/**
 * @description
 * IClientError is not the same as a bad request error, 400.
 * It is meant to indicate that an error was thrown from the fetch api.
 */
interface IClientError {
  code: -1;
  name: "client error";
  err: unknown;
}

type TAPIResponseUnion<T> =
  | IOkResponse<T>
  | ICreatedResponse<T>
  | IBadResponse
  | IUnauthorizedResponse
  | INotFoundResponse
  | IServerErrorResponse
  | IUnknownResponse;

type TAPIResult<T> = TAPIResponseUnion<T> | IClientError;

export type {
  IAPIOptions,
  IClientError,
  TAPIResult,
  TDeleteOptions,
  TGetOptions,
  TJsonObj,
  TPath,
  TPostOptions,
  TPutOptions,
};
