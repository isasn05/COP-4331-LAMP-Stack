/* global describe, test, expect, beforeAll, fetch */
const crypto = require("crypto");

/**
 * INTEGRATION tests: call the real PHP API (running on `php -S`) which talks
 * to a real MySQL database. In CI, GitHub Actions starts both for us.
 *
 * Locally:  API_BASE=http://localhost:8000/api npm run test:integration
 */
const API_BASE = process.env.API_BASE || "http://127.0.0.1:8000/api";

// Seeded by tests/db/schema.sql.
// Your front end runs md5(password) before calling Login.php, so the test does the same.
// If your code.js sends the plain password instead, use: password: "testpass"
const md5 = (s) => crypto.createHash("md5").update(s).digest("hex");
const TEST_USER = { login: "testuser", password: md5("testpass") };

async function post(endpoint, body) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${endpoint} did not return JSON. Raw response:\n${text}`);
  }
  return { status: res.status, json };
}

describe("Login.php", () => {
  test("valid credentials return the user's id and name", async () => {
    const { status, json } = await post("Login.php", TEST_USER);
    expect(status).toBe(200);
    expect(json).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        firstName: expect.any(String),
        lastName: expect.any(String),
        error: "",
      })
    );
    expect(json.id).toBeGreaterThan(0);
  });

  test("wrong password returns id 0 and an error message", async () => {
    const { json } = await post("Login.php", { login: TEST_USER.login, password: "wrong" });
    expect(json.id).toBe(0);
    expect(json.error).not.toBe("");
  });
});

describe("AddColor.php + SearchColors.php", () => {
  let userId;
  const colorName = `CI Teal ${Date.now()}`;

  beforeAll(async () => {
    const { json } = await post("Login.php", TEST_USER);
    userId = json.id;
  });

  test("adding a color returns an empty error", async () => {
    const { status, json } = await post("AddColor.php", { color: colorName, userId });
    expect(status).toBe(200);
    expect(json).toHaveProperty("error", "");
  });

  test("searching finds the color that was just added", async () => {
    const { json } = await post("SearchColors.php", { search: "CI Teal", userId });
    expect(json.error).toBe("");
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results).toContain(colorName);
  });

  test("searching for something that does not exist returns an error", async () => {
    const { json } = await post("SearchColors.php", { search: "zzz-no-such-color", userId });
    expect(json.error).not.toBe("");
  });
});
