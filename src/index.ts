import {
	IAPIOptions,
	TAPIResult,
	TDeleteOptions,
	TGetOptions,
	TPostOptions,
	TPutOptions,
} from "./types.ts";

class APIClient {
	#baseUrl: string;
	#defaultHeaders?: Headers;

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

			const status = res.status;
			if (status === 200) {
				const data = await res.json();
				responseResult = { code: 200, name: "ok", data };
			} else if (status === 201) {
				const data = await res.json();
				responseResult = { code: 201, name: "created", data };
			} else if (status === 400) {
				responseResult = { code: 400, name: "bad request" };
			} else if (status === 401) {
				responseResult = { code: 401, name: "unauthorized" };
			} else if (status === 404) {
				responseResult = { code: 404, name: "not found" };
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

	#createHeaders(optionHeaders: IAPIOptions["headers"]): Headers | undefined {
		const defaultHeadersArray = this.#defaultHeaders !== undefined
			? this.#defaultHeaders.entries()
			: [];
		const optionHeadersArray = optionHeaders !== undefined ? optionHeaders : [];

		const headersInit = [
			...defaultHeadersArray,
			...optionHeadersArray,
		];

		return new Headers(headersInit);
	}

	get<T>(options: TGetOptions) {
		return this.#apiCall<T>({
			method: "get",
			...options,
		});
	}

	post<T>(
		options: TPostOptions,
	) {
		return this.#apiCall<T>({
			method: "post",
			...options,
		});
	}

	put<T>(
		options: TPutOptions,
	) {
		return this.#apiCall<T>({
			method: "put",
			...options,
		});
	}

	delete<T>(options: TDeleteOptions) {
		return this.#apiCall<T>({
			method: "delete",
			...options,
		});
	}
}

export default APIClient;
