import { describe, it, expect, vi } from "vitest";

vi.mock("next/server", () => {
  return {
    NextResponse: {
      json: (body: any, init?: ResponseInit) => {
        return new Response(JSON.stringify(body), {
          ...init,
          headers: {
            "Content-Type": "application/json",
            ...init?.headers,
          },
        });
      },
    },
    NextRequest: class extends Request { },
  };
});

import { extractAuthCookies } from "./ncb-utils";

describe("extractAuthCookies", () => {
  it("returns empty string if cookieHeader is empty", () => {
    expect(extractAuthCookies("")).toBe("");
  });

  it("returns empty string if cookieHeader is undefined or null", () => {
    // @ts-ignore: Intentionally passing invalid types to test the !cookieHeader check
    expect(extractAuthCookies(undefined)).toBe("");
    // @ts-ignore
    expect(extractAuthCookies(null)).toBe("");
  });

  it("extracts a single session_token cookie", () => {
    const header = "better-auth.session_token=12345";
    expect(extractAuthCookies(header)).toBe("better-auth.session_token=12345");
  });

  it("extracts a single session_data cookie", () => {
    const header = "better-auth.session_data=abcde";
    expect(extractAuthCookies(header)).toBe("better-auth.session_data=abcde");
  });

  it("extracts multiple auth cookies and joins them with '; '", () => {
    const header = "better-auth.session_token=12345; better-auth.session_data=abcde";
    expect(extractAuthCookies(header)).toBe("better-auth.session_token=12345; better-auth.session_data=abcde");
  });

  it("filters out non-auth cookies", () => {
    const header = "other_cookie=xyz; better-auth.session_token=12345; yet_another=789";
    expect(extractAuthCookies(header)).toBe("better-auth.session_token=12345");
  });

  it("handles mixed spacing in the cookie header", () => {
    const header = "other_cookie=xyz;better-auth.session_data=abcde;  better-auth.session_token=12345  ;yet_another=789";
    expect(extractAuthCookies(header)).toBe("better-auth.session_data=abcde; better-auth.session_token=12345");
  });

  it("returns empty string if no auth cookies are present", () => {
    const header = "other_cookie=xyz; yet_another=789";
    expect(extractAuthCookies(header)).toBe("");
  });

  it("does not match cookies that only partially match the prefix if they don't start with it", () => {
    const header = "not-better-auth.session_token=12345; my-better-auth.session_data=abcde";
    expect(extractAuthCookies(header)).toBe("");
  });
});
