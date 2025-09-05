import type {
  IAPIOptions,
  TAPIResult,
  TDeleteOptions,
  TGetOptions,
  TNoBodyAPIOptions,
  TPostOptions,
  TPutOptions,
  TDefaultAPIOptions,
  TQuery,
} from "./types.ts";

/**
 * @description
 * APIClient is essentially another interface for fetch, it provides a simple structure for the most basic of operations
 */
class APIClient {
  #baseUrl: string;
  #defaultOptions?: TNoBodyAPIOptions;

  /**
   * @description
   * APIClient is essentially another interface for fetch, it provides a simple structure for the most basic of operations.
   * @param baseUrl - The url to use for every method call using this APIClient instance.
   * @param defaultOptions - The options to apply on every api call.
   */
  constructor(baseUrl: string, defaultOptions?: TDefaultAPIOptions) {
    this.#baseUrl = baseUrl;
    this.#defaultOptions = defaultOptions;
  }

  /**
   * @description
   * #apiCall is the base method for calling an API
   * @param options - Used for specifying the path, query parameters, body etc.
   */
  async #apiCall<T>(options: IAPIOptions): Promise<TAPIResult<T>> {
    let path = "";
    if (options.path) {
      path = options.path;
    }

    const query = this.#createQueryString(options.query);

    const config = this.#applyOptions(options);

    try {
      const res = await fetch(`${this.#baseUrl}${path}${query}`, {
        ...config,
        body: JSON.stringify(options.body),
      });

      let responseResult: TAPIResult<T>;
      // Data is defined by default as an empty object to avoid errors
      // If the integrator cannot trust if they are going to recieve json data they should be allowed to define it themselves.
      let data = {} as T;

      // Json data is only assumed if the content type header is provided and is set to json
      if (res.headers.get("Content-Type") === "application/json") {
        data = await res.json();
      }

      const status = res.status;
      if (status === 200) {
        responseResult = { code: 200, name: "ok", data };
      } else if (status === 201) {
        responseResult = { code: 201, name: "created", data };
      } else if (status === 400) {
        responseResult = { code: 400, name: "bad request" };
      } else if (status === 401) {
        responseResult = { code: 401, name: "unauthorized" };
      } else if (status === 404) {
        responseResult = { code: 404, name: "not found" };
      } else if (status === 500) {
        responseResult = { code: 500, name: "server error" };
      } else {
        responseResult = {
          code: 0,
          statusCode: status,
          name: "unknown",
        };
      }

      return responseResult;
    } catch (err) {
      return { code: -1, name: "client error", err };
    }
  }

  /**
   * @description
   * #applyConfigs merges the default config with the provided one into a single object.
   * @param options - The options to merge with the default options
   */
  #applyOptions(options: IAPIOptions): IAPIOptions {
    // Create headers
    const defaultHeadersArray =
      this.#defaultOptions?.headers !== undefined
        ? this.#defaultOptions.headers.entries()
        : [];
    const optionHeadersArray =
      options.headers !== undefined ? options.headers : [];

    const headersInit = [...defaultHeadersArray, ...optionHeadersArray];
    const headers =
      headersInit.length > 0 ? new Headers(headersInit) : undefined;

    let credentials = this.#defaultOptions?.credentials;
    if (options.credentials) {
      credentials = options.credentials;
    }

    return {
      method: options.method,
      headers,
      credentials,
    };
  }

  /**
   * @description
   * #createQueryString creates a query string using the given options object and the default options
   * @param queryRecord - The query object from the provided options
   */
  #createQueryString(queryRecord?: TQuery): string {
    let optionQueryPairs: string[] = [];
    if (queryRecord !== undefined) {
      optionQueryPairs = this.#createQueryPairs(queryRecord);
    }

    let defaultQueryPairs: string[] = [];
    if (this.#defaultOptions?.query !== undefined) {
      optionQueryPairs = this.#createQueryPairs(this.#defaultOptions.query);
    }

    const queryPairs = [...optionQueryPairs, ...defaultQueryPairs];
    if (queryPairs.length === 0) {
      return "";
    }

    return `?${queryPairs.join("&")}`;
  }

  /**
   * @description
   * #createQueryPairs creates an array of string pairs, e.g. "foo=bar"
   * @param queryRecord - The query object from the provided options
   * @returns An array with string string pairs, e.g. "foo=bar
   */
  #createQueryPairs(queryRecord: TQuery): string[] {
    const pairs = Object.entries(queryRecord).map(
      ([key, value]) => `${key}=${value}`,
    );
    const queryPairs = pairs;

    return queryPairs;
  }

  /**
   * @description
   * get creates a get request
   * @param options - The options that can apply to a get request
   */
  get<T>(options?: TGetOptions): Promise<TAPIResult<T>> {
    return this.#apiCall<T>({
      method: "get",
      ...options,
    });
  }

  /**
   * @description
   * post creates a post request
   * @param options - The options that can apply to a post request
   */
  post<T>(options: TPostOptions): Promise<TAPIResult<T>> {
    return this.#apiCall<T>({
      method: "post",
      ...options,
    });
  }

  /**
   * @description
   * put creates a put request
   * @param options - The options that can apply to a put request
   */
  put<T>(options: TPutOptions): Promise<TAPIResult<T>> {
    return this.#apiCall<T>({
      method: "put",
      ...options,
    });
  }

  /**
   * @description
   * delete creates a delete request
   * @param options - The options that can apply to a delete request
   */
  delete<T>(options?: TDeleteOptions): Promise<TAPIResult<T>> {
    return this.#apiCall<T>({
      method: "delete",
      ...options,
    });
  }
}

export default APIClient;
