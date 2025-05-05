import { assertEquals } from "@std/assert";
import { ErrorCode, HttpMethod, StatusCode } from "../_shared/response.ts";

// Mock function since we can't directly import the Deno.serve handler
async function simulateRequest(
  url: string,
  method: string,
  body: unknown = null,
) {
  // Create request object
  const requestInit: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    requestInit.body = JSON.stringify(body);
  }

  const req = new Request(url, requestInit);

  // Import the module which will execute Deno.serve()
  const mod = await import("./index.ts");

  // Access the request handler from Deno.serve
  // This is a bit of a hack but works for testing
  // @ts-ignore - accessing internal property for testing
  const handler = Deno.serve.calls[Deno.serve.calls.length - 1][0];

  // Call the handler with our request
  return await handler(req);
}

Deno.test("Hello world function - POST with valid name", async () => {
  const response = await simulateRequest(
    "https://example.com/functions/v1/hello-world",
    HttpMethod.POST,
    { name: "Test User" },
  );

  const data = await response.json();

  assertEquals(response.status, StatusCode.OK);
  assertEquals(data.success, true);
  assertEquals(data.data.message, "Hello Test User!");
  assertEquals(data.error, null);
});

Deno.test("Hello world function - POST with missing name", async () => {
  const response = await simulateRequest(
    "https://example.com/functions/v1/hello-world",
    HttpMethod.POST,
    {},
  );

  const data = await response.json();

  assertEquals(response.status, StatusCode.BAD_REQUEST);
  assertEquals(data.success, false);
  assertEquals(data.data, null);
  assertEquals(data.error.code, ErrorCode.BAD_REQUEST);
  assertEquals(data.error.message, "Name parameter is required");
});

Deno.test("Hello world function - Method not allowed", async () => {
  const response = await simulateRequest(
    "https://example.com/functions/v1/hello-world",
    HttpMethod.GET,
  );

  const data = await response.json();

  assertEquals(response.status, StatusCode.METHOD_NOT_ALLOWED);
  assertEquals(data.success, false);
  assertEquals(data.data, null);
  assertEquals(data.error.code, ErrorCode.METHOD_NOT_ALLOWED);
});

Deno.test("Hello world function - CORS preflight", async () => {
  const response = await simulateRequest(
    "https://example.com/functions/v1/hello-world",
    HttpMethod.OPTIONS,
  );

  assertEquals(response.status, 204);
  assertEquals(response.headers.get("Access-Control-Allow-Origin"), "*");
});
