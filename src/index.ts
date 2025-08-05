import {
  IAPIOptions,
  TAPIResult,
  TDeleteOptions,
  TGetOptions,
  TPostOptions,
  TPutOptions,
} from "./types.ts";

/**
 * @description
 * APIClient is essentially another interface for fetch, it provides a simple structure for the most basic of operations
 */
class APIClient {
  #baseUrl: string;
  #defaultHeaders?: Headers;

  /**
   * @description
   * APIClient is essentially another interface for fetch, it provides a simple structure for the most basic of operations.
   * @param baseUrl - The url to use for every method call using this APIClient instance.
   * @param defaultHeaders - The headers to apply for every method call using this APIClient instance.
   */
  constructor(baseUrl: string, defaultHeaders?: Headers) {
    this.#baseUrl = baseUrl;
    this.#defaultHeaders = defaultHeaders;
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

    let query = "";
    if (options.query) {
      const pairs = Object.entries(options.query).map(([key, value]) =>
        `${key}=${value}`
      );
      query = `?${pairs.join("&")}`;
    }

    const headers = this.#createHeaders(options.headers);

    try {
      const res = await fetch(`${this.#baseUrl}${path}${query}`, {
        method: options.method,
        headers,
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
          code: -1,
          statusCode: status,
          name: "unknown",
        };
      }

      return responseResult;
    } catch (err) {
      return { name: "client error", err };
    }
  }

  /**
   * @description
   * #createHeaders constructs the headers from the #defaultHeaders property and the provided optionHeaders parameter
   * @param optionHeaders - The headers to apply to the request
   */
  #createHeaders(optionHeaders: IAPIOptions["headers"]): Headers | undefined {
    const defaultHeadersArray = this.#defaultHeaders !== undefined
      ? this.#defaultHeaders.entries()
      : [];
    const optionHeadersArray = optionHeaders !== undefined ? optionHeaders : [];

    const headersInit = [
      ...defaultHeadersArray,
      ...optionHeadersArray,
    ];

    return headersInit.length > 0 ? new Headers(headersInit) : undefined;
  }

  /**
   * @description
   * get creates a get request
   * @param options - The options that can apply to a get request
   */
  get<T>(options?: TGetOptions) {
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
  post<T>(
    options: TPostOptions,
  ) {
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
  put<T>(
    options: TPutOptions,
  ) {
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
  delete<T>(options?: TDeleteOptions) {
    return this.#apiCall<T>({
      method: "delete",
      ...options,
    });
  }
}

export default APIClient;
