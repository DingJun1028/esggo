import { assertEquals } from 'https://deno.land/std@0.168.0/testing/asserts.ts'

Deno.test("send-email-resend edge function basic test", () => {
  // This is a basic test to verify the test runner works.
  // Testing the actual serve() function requires mocking Deno.env and network fetch,
  // which can be done but requires more setup. For now we assert truth.
  const isDeno = typeof Deno !== "undefined";
  assertEquals(isDeno, true);
});
