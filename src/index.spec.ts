import { afterEach, describe, expect, it, vi } from "vitest";
import APIClient from "./index";
import {
  TDeleteOptions,
  TGetOptions,
  TPostOptions,
  TPutOptions,
  TDefaultAPIOptions,
} from "./types.ts";

afterEach(() => vi.resetAllMocks());

function createClient(defaultConfig?: TDefaultAPIOptions) {
  return new APIClient("/foo", defaultConfig);
}

function createGet(config?: {
  options?: TGetOptions;
  defaultOptions?: TDefaultAPIOptions;
}) {
  return () => createClient(config?.defaultOptions).get(config?.options);
}

function createPost(config: {
  options: TPostOptions;
  defaultOptions?: TDefaultAPIOptions;
}) {
  return () => createClient(config.defaultOptions).post(config.options);
}

function createPut(config: {
  options: TPutOptions;
  defaultOptions?: TDefaultAPIOptions;
}) {
  return () => createClient(config.defaultOptions).put(config.options);
}

function createDelete(config?: {
  options?: TDeleteOptions;
  defaultOptions?: TDefaultAPIOptions;
}) {
  return () => createClient(config?.defaultOptions).delete(config?.options);
}

describe("Default", () => {
  const query = { pokemon: "pikachu", id: 1, isPremium: false };
  it.each([
    createGet({
      defaultOptions: {
        query,
      },
    }),
    createPost({
      options: {
        body: {},
      },
      defaultOptions: {
        query,
      },
    }),
    createPut({
      options: {
        body: {},
      },
      defaultOptions: {
        query,
      },
    }),
    createDelete({
      defaultOptions: {
        query,
      },
    }),
  ])("Should call fetch with correct query string", async (method) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response());

    await method();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "/foo?pokemon=pikachu&id=1&isPremium=false",
    );
  });

  it.each([
    createGet({
      defaultOptions: {
        query: {},
      },
    }),
    createPost({
      options: {
        body: {},
      },
      defaultOptions: {
        query: {},
      },
    }),
    createPut({
      options: {
        body: {},
      },
      defaultOptions: {
        query: {},
      },
    }),
    createDelete({
      defaultOptions: {
        query: {},
      },
    }),
  ])(
    "Should call fetch with no query string when query object is empty",
    async (method) => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockImplementation(async () => new Response());

      await method();

      expect(fetchSpy).toHaveBeenCalledOnce();
      expect(fetchSpy.mock.calls[0][0]).toBe("/foo");
    },
  );

  const headersExpectation = new Headers({
    "content-type": "application/json",
  });
  it.each([
    createGet({
      defaultOptions: {
        headers: headersExpectation,
      },
    }),
    createPost({
      options: {
        body: {},
      },
      defaultOptions: {
        headers: headersExpectation,
      },
    }),
    createPut({
      options: {
        body: {},
      },
      defaultOptions: {
        headers: headersExpectation,
      },
    }),
    createDelete({
      defaultOptions: {
        headers: headersExpectation,
      },
    }),
  ])("Should call fetch with correct headers", async (method) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response());

    await method();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][1]?.headers).toStrictEqual(
      headersExpectation,
    );
  });

  const credentialsExpectation = "include";
  it.each([
    createGet({
      defaultOptions: {
        credentials: credentialsExpectation,
      },
    }),
    createPost({
      options: {
        body: {},
      },
      defaultOptions: {
        credentials: credentialsExpectation,
      },
    }),
    createPut({
      options: {
        body: {},
      },
      defaultOptions: {
        credentials: credentialsExpectation,
      },
    }),
    createDelete({
      defaultOptions: {
        credentials: credentialsExpectation,
      },
    }),
  ])("Should call fetch with correct credentials", async (method) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response());

    await method();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][1]?.credentials).toStrictEqual(
      credentialsExpectation,
    );
  });
});

describe("Options", () => {
  const emptyBody = { options: { body: {} } };

  it.each([
    { method: createGet(), methodName: "get" },
    { method: createPost(emptyBody), methodName: "post" },
    { method: createPut(emptyBody), methodName: "put" },
    { method: createDelete(), methodName: "delete" },
  ])("Should call fetch with correct method", async (methodObj) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response());

    await methodObj.method();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][1]?.method).toBe(methodObj.methodName);
  });

  it.each([
    createGet(),
    createPost(emptyBody),
    createPut(emptyBody),
    createDelete(),
  ])("Should call fetch with correct base path", async (method) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response());

    await method();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][0]).toBe("/foo");
  });

  it.each([
    createGet({ options: { path: "/bar" } }),
    createPost({ options: { path: "/bar", body: {} } }),
    createPut({ options: { path: "/bar", body: {} } }),
    createDelete({ options: { path: "/bar" } }),
  ])("Should call fetch with correct config path", async (method) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response());

    await method();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][0]).toBe("/foo/bar");
  });

  it.each([
    createGet({
      options: {
        query: {
          bar: "baz",
          pokemon: "pikachu",
        },
      },
    }),
    createPost({
      options: {
        query: {
          bar: "baz",
          pokemon: "pikachu",
        },
        body: {},
      },
    }),
    createPut({
      options: {
        query: {
          bar: "baz",
          pokemon: "pikachu",
        },
        body: {},
      },
    }),
    createDelete({
      options: {
        query: {
          bar: "baz",
          pokemon: "pikachu",
        },
      },
    }),
  ])("Should call fetch with correct query string", async (method) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response());

    await method();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][0]).toBe("/foo?bar=baz&pokemon=pikachu");
  });

  it.each([
    createGet({
      options: {
        query: {},
      },
    }),
    createPost({
      options: {
        body: {},
        query: {},
      },
    }),
    createPut({
      options: {
        query: {},
        body: {},
      },
    }),
    createDelete({
      options: {
        query: {},
      },
    }),
  ])(
    "Should call fetch with no query string when query object is empty",
    async (method) => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockImplementation(async () => new Response());

      await method();

      expect(fetchSpy).toHaveBeenCalledOnce();
      expect(fetchSpy.mock.calls[0][0]).toBe("/foo");
    },
  );

  const headersExpectation = new Headers({
    "content-type": "application/json",
  });
  it.each([
    createGet({
      options: {
        headers: headersExpectation,
      },
    }),
    createPost({
      options: {
        headers: headersExpectation,
        body: {},
      },
    }),
    createPut({
      options: {
        headers: headersExpectation,
        body: {},
      },
    }),
    createDelete({
      options: {
        headers: headersExpectation,
      },
    }),
  ])("Should call fetch with correct headers", async (method) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response());

    await method();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][1]?.headers).toStrictEqual(
      headersExpectation,
    );
  });

  const credentialsExpectation = "include";
  it.each([
    createGet({
      options: {
        credentials: credentialsExpectation,
      },
    }),
    createPost({
      options: {
        credentials: credentialsExpectation,
        body: {},
      },
    }),
    createPut({
      options: {
        credentials: credentialsExpectation,
        body: {},
      },
    }),
    createDelete({
      options: {
        credentials: credentialsExpectation,
      },
    }),
  ])("Should call fetch with correct credentials", async (method) => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () => new Response());

    await method();

    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][1]?.credentials).toStrictEqual(
      credentialsExpectation,
    );
  });

  const bodyExpectation = { options: { body: { foo: "bar" } } };
  it.each([createPost(bodyExpectation), createPut(bodyExpectation)])(
    "Should call fetch with correct body",
    async (method) => {
      const fetchSpy = vi
        .spyOn(globalThis, "fetch")
        .mockImplementation(async () => new Response());

      await method();

      expect(fetchSpy.mock.calls[0][1]?.body).toStrictEqual(
        JSON.stringify(bodyExpectation.options.body),
      );
    },
  );

  it.each([
    createGet(),
    createPost({
      options: {
        body: {},
      },
    }),
    createPut({
      options: {
        body: {},
      },
    }),
    createDelete(),
  ])("Should return correct data with status 200", async (method) => {
    const apiJson = { bar: "baz" };
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(apiJson), {
          headers: {
            "Content-Type": "application/json",
          },
        }),
    );

    const response = await method();

    expect(response.code).toBe(200);
    expect(response.name).toBe("ok");
    // @ts-ignore if the previous test is a success then should be no error
    expect(response.data).toStrictEqual(apiJson);
  });

  it.each([
    createGet(),
    createPost({
      options: {
        body: {},
      },
    }),
    createPut({
      options: {
        body: {},
      },
    }),
    createDelete(),
  ])("Should return correct data with status 201", async (method) => {
    const apiJson = { bar: "baz" };
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(apiJson), {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        }),
    );

    const response = await method();

    expect(response.code).toBe(201);
    expect(response.name).toBe("created");
    // @ts-ignore if the previous test is a success then should be no error
    expect(response.data).toStrictEqual(apiJson);
  });

  it.each([
    createGet(),
    createPost({
      options: {
        body: {},
      },
    }),
    createPut({
      options: {
        body: {},
      },
    }),
    createDelete(),
  ])("Should return status 400", async (method) => {
    const apiJson = { bar: "baz" };
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(apiJson), {
          status: 400,
        }),
    );

    const response = await method();

    expect(response.code).toBe(400);
    expect(response.name).toBe("bad request");
  });

  it.each([
    createGet(),
    createPost({
      options: {
        body: {},
      },
    }),
    createPut({
      options: {
        body: {},
      },
    }),
    createDelete(),
  ])("Should return status 401", async (method) => {
    const apiJson = { bar: "baz" };
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(apiJson), {
          status: 401,
        }),
    );

    const response = await method();

    expect(response.code).toBe(401);
    expect(response.name).toBe("unauthorized");
  });

  it.each([
    createGet(),
    createPost({
      options: {
        body: {},
      },
    }),
    createPut({
      options: {
        body: {},
      },
    }),
    createDelete(),
  ])("Should return status 404", async (method) => {
    const apiJson = { bar: "baz" };
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(apiJson), {
          status: 404,
        }),
    );

    const response = await method();

    expect(response.code).toBe(404);
    expect(response.name).toBe("not found");
  });

  it.each([
    createGet(),
    createPost({
      options: {
        body: {},
      },
    }),
    createPut({
      options: {
        body: {},
      },
    }),
    createDelete(),
  ])("Should return status 500", async (method) => {
    const apiJson = { bar: "baz" };
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () =>
        new Response(JSON.stringify(apiJson), {
          status: 500,
        }),
    );

    const response = await method();

    expect(response.code).toBe(500);
    expect(response.name).toBe("server error");
  });

  it.each([
    createGet(),
    createPost({
      options: {
        body: {},
      },
    }),
    createPut({
      options: {
        body: {},
      },
    }),
    createDelete(),
  ])("Should return client error", async (method) => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
      throw Error();
    });

    const response = await method();

    expect(response.code).toBe(-1);
    expect(response.name).toBe("client error");
  });
});
