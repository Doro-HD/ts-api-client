import { assertEquals } from "@std/assert";
import { Stub, stub } from "jsr:@std/testing/mock";

function createFetchStub(
	responseFn: () => Promise<Response>,
) {
	return stub(globalThis, "fetch", responseFn);
}

Deno.test("Foo", () => {
	const fetchStub = createFetchStub(async () => new Response());

	assertEquals(false, true);

	fetchStub.restore();
});
