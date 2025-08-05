import { assertEquals } from "@std/assert";
import { stub } from "jsr:@std/testing/mock";
import APIClient from "./index.ts";

function createFetchStub(
  responseFn: () => Promise<Response>,
) {
  return stub(globalThis, "fetch", responseFn);
}

Deno.test("Get", async (t) => {
  await t.step("Should call fetch with the correct path", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.get({
      path: "/bar",
    });

    assertEquals(fetchStub.calls[0].args[0], "/foo/bar");

    fetchStub.restore();
  });

  await t.step("Should call fetch with the correct query string", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.get({
      query: {
        bar: "baz",
        pokemon: "pikachu",
      },
    });

    assertEquals(
      fetchStub.calls[0].args[0],
      "/foo?bar=baz&pokemon=pikachu",
    );

    fetchStub.restore();
  });

  await t.step("Should call fetch with a post method", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.get();

    assertEquals(
      fetchStub.calls[0].args[1]?.method,
      "get",
    );

    fetchStub.restore();
  });

  await t.step("Should call fetch with the correct headers", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");
    const expectation = new Headers({ "content-type": "application/json" });

    await apiClient.get({
      headers: expectation,
    });

    assertEquals(
      fetchStub.calls[0].args[1]?.headers,
      expectation,
    );

    fetchStub.restore();
  });

  await t.step("Should return an ok result on a response 200", async () => {
    const apiJson = { bar: "baz" };
    const fetchStub = createFetchStub(async () =>
      new Response(JSON.stringify(apiJson), {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    const apiClient = new APIClient("");

    const getResult = await apiClient.get<typeof apiJson>();

    assertEquals(getResult.name, "ok");
    // @ts-ignore if the previous test is a success then there will be no error
    assertEquals(getResult.data, apiJson);

    fetchStub.restore();
  });

  await t.step(
    "Should return an created result on a response 201",
    async () => {
      const apiJson = { bar: "baz" };
      const fetchStub = createFetchStub(async () =>
        new Response(JSON.stringify(apiJson), {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.get<typeof apiJson>();

      assertEquals(getResult.name, "created");
      // @ts-ignore if the previous test is a success then there will be no error
      assertEquals(getResult.data, apiJson);

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an bad request result on a response 400",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 400,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.get();

      assertEquals(getResult.name, "bad request");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an unauthorized result on a response 401",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 401,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.get();

      assertEquals(getResult.name, "unauthorized");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an not found result on a response 404",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 404,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.get();

      assertEquals(getResult.name, "not found");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an server error result on a response 500",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 500,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.get();

      assertEquals(getResult.name, "server error");

      fetchStub.restore();
    },
  );
});

Deno.test("Post", async (t) => {
  await t.step("Should call fetch with the correct path", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.post({
      path: "/bar",
      body: {},
    });

    assertEquals(fetchStub.calls[0].args[0], "/foo/bar");

    fetchStub.restore();
  });

  await t.step("Should call fetch with the correct query string", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.post({
      query: {
        bar: "baz",
        pokemon: "pikachu",
      },
      body: {},
    });

    assertEquals(
      fetchStub.calls[0].args[0],
      "/foo?bar=baz&pokemon=pikachu",
    );

    fetchStub.restore();
  });

  await t.step("Should call fetch with a post method", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.post({
      body: {},
    });

    assertEquals(
      fetchStub.calls[0].args[1]?.method,
      "post",
    );

    fetchStub.restore();
  });

  await t.step("Should call fetch with the correct headers", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");
    const expectation = new Headers({ "content-type": "application/json" });

    await apiClient.post({
      headers: expectation,
      body: {},
    });

    assertEquals(
      fetchStub.calls[0].args[1]?.headers,
      expectation,
    );

    fetchStub.restore();
  });

  await t.step("Should call fetch with the correct body", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");
    const expectation = { foo: "bar" };

    await apiClient.post({
      body: expectation,
    });

    assertEquals(
      fetchStub.calls[0].args[1]?.body,
      JSON.stringify(expectation),
    );

    fetchStub.restore();
  });

  await t.step("Should return an ok result on a response 200", async () => {
    const apiJson = { bar: "baz" };
    const fetchStub = createFetchStub(async () =>
      new Response(JSON.stringify(apiJson), {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    const apiClient = new APIClient("");

    const getResult = await apiClient.post<typeof apiJson>({
      body: {},
    });

    assertEquals(getResult.name, "ok");
    // @ts-ignore if the previous test is a success then there will be no error
    assertEquals(getResult.data, apiJson);

    fetchStub.restore();
  });

  await t.step(
    "Should return an created result on a response 201",
    async () => {
      const apiJson = { bar: "baz" };
      const fetchStub = createFetchStub(async () =>
        new Response(JSON.stringify(apiJson), {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.post<typeof apiJson>({
        body: {},
      });

      assertEquals(getResult.name, "created");
      // @ts-ignore if the previous test is a success then there will be no error
      assertEquals(getResult.data, apiJson);

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an bad request result on a response 400",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 400,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.post({
        body: {},
      });

      assertEquals(getResult.name, "bad request");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an unauthorized result on a response 401",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 401,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.post({
        body: {},
      });

      assertEquals(getResult.name, "unauthorized");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an not found result on a response 404",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 404,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.post({
        body: {},
      });

      assertEquals(getResult.name, "not found");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an server error result on a response 500",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 500,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.post({
        body: {},
      });

      assertEquals(getResult.name, "server error");

      fetchStub.restore();
    },
  );
});

Deno.test("Put", async (t) => {
  await t.step("Should call fetch with the correct path", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.put({
      path: "/bar",
      body: {},
    });

    assertEquals(fetchStub.calls[0].args[0], "/foo/bar");

    fetchStub.restore();
  });

  await t.step("Should call fetch with the correct query string", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.put({
      query: {
        bar: "baz",
        pokemon: "pikachu",
      },
      body: {},
    });

    assertEquals(
      fetchStub.calls[0].args[0],
      "/foo?bar=baz&pokemon=pikachu",
    );

    fetchStub.restore();
  });

  await t.step("Should call fetch with a post method", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.put({
      body: {},
    });

    assertEquals(
      fetchStub.calls[0].args[1]?.method,
      "put",
    );

    fetchStub.restore();
  });

  await t.step("Should call fetch with the correct headers", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");
    const expectation = new Headers({ "content-type": "application/json" });

    await apiClient.put({
      headers: expectation,
      body: {},
    });

    assertEquals(
      fetchStub.calls[0].args[1]?.headers,
      expectation,
    );

    fetchStub.restore();
  });

  await t.step("Should call fetch with the correct body", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");
    const expectation = { foo: "bar" };

    await apiClient.put({
      body: expectation,
    });

    assertEquals(
      fetchStub.calls[0].args[1]?.body,
      JSON.stringify(expectation),
    );

    fetchStub.restore();
  });

  await t.step("Should return an ok result on a response 200", async () => {
    const apiJson = { bar: "baz" };
    const fetchStub = createFetchStub(async () =>
      new Response(JSON.stringify(apiJson), {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    const apiClient = new APIClient("");

    const getResult = await apiClient.put<typeof apiJson>({
      body: {},
    });

    assertEquals(getResult.name, "ok");
    // @ts-ignore if the previous test is a success then there will be no error
    assertEquals(getResult.data, apiJson);

    fetchStub.restore();
  });

  await t.step(
    "Should return an created result on a response 201",
    async () => {
      const apiJson = { bar: "baz" };
      const fetchStub = createFetchStub(async () =>
        new Response(JSON.stringify(apiJson), {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.put<typeof apiJson>({
        body: {},
      });

      assertEquals(getResult.name, "created");
      // @ts-ignore if the previous test is a success then there will be no error
      assertEquals(getResult.data, apiJson);

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an bad request result on a response 400",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 400,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.put({
        body: {},
      });

      assertEquals(getResult.name, "bad request");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an unauthorized result on a response 401",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 401,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.put({
        body: {},
      });

      assertEquals(getResult.name, "unauthorized");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an not found result on a response 404",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 404,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.put({
        body: {},
      });

      assertEquals(getResult.name, "not found");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an server error result on a response 500",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 500,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.put({
        body: {},
      });

      assertEquals(getResult.name, "server error");

      fetchStub.restore();
    },
  );
});

Deno.test("Delete", async (t) => {
  await t.step("Should call fetch with the correct path", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.delete({
      path: "/bar",
    });

    assertEquals(fetchStub.calls[0].args[0], "/foo/bar");

    fetchStub.restore();
  });

  await t.step("Should call fetch with the correct query string", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.get({
      query: {
        bar: "baz",
        pokemon: "pikachu",
      },
    });

    assertEquals(
      fetchStub.calls[0].args[0],
      "/foo?bar=baz&pokemon=pikachu",
    );

    fetchStub.restore();
  });

  await t.step("Should call fetch with a post method", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");

    await apiClient.delete();

    assertEquals(
      fetchStub.calls[0].args[1]?.method,
      "delete",
    );

    fetchStub.restore();
  });

  await t.step("Should call fetch with the correct headers", async () => {
    const fetchStub = createFetchStub(async () => new Response());

    const apiClient = new APIClient("/foo");
    const expectation = new Headers({ "content-type": "application/json" });

    await apiClient.delete({
      headers: expectation,
    });

    assertEquals(
      fetchStub.calls[0].args[1]?.headers,
      expectation,
    );

    fetchStub.restore();
  });

  await t.step("Should return an ok result on a response 200", async () => {
    const apiJson = { bar: "baz" };
    const fetchStub = createFetchStub(async () =>
      new Response(JSON.stringify(apiJson), {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    const apiClient = new APIClient("");

    const getResult = await apiClient.delete<typeof apiJson>();

    assertEquals(getResult.name, "ok");
    // @ts-ignore if the previous test is a success then there will be no error
    assertEquals(getResult.data, apiJson);

    fetchStub.restore();
  });

  await t.step(
    "Should return an created result on a response 201",
    async () => {
      const apiJson = { bar: "baz" };
      const fetchStub = createFetchStub(async () =>
        new Response(JSON.stringify(apiJson), {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.delete<typeof apiJson>();

      assertEquals(getResult.name, "created");
      // @ts-ignore if the previous test is a success then there will be no error
      assertEquals(getResult.data, apiJson);

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an bad request result on a response 400",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 400,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.delete();

      assertEquals(getResult.name, "bad request");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an unauthorized result on a response 401",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 401,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.delete();

      assertEquals(getResult.name, "unauthorized");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an not found result on a response 404",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 404,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.delete();

      assertEquals(getResult.name, "not found");

      fetchStub.restore();
    },
  );

  await t.step(
    "Should return an server error result on a response 500",
    async () => {
      const fetchStub = createFetchStub(async () =>
        new Response(undefined, {
          status: 500,
        })
      );
      const apiClient = new APIClient("");

      const getResult = await apiClient.delete();

      assertEquals(getResult.name, "server error");

      fetchStub.restore();
    },
  );
});
