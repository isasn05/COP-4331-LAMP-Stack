/* global describe, test, expect, require */
/**
 * Front-end UNIT tests: pure functions, no server or database needed.
 */
const {
  formatColorName,
  validateColorName,
  isHexColor,
  validateLoginForm,
  buildSearchPayload,
} = require("../../js/validation");

describe("formatColorName", () => {
  test("trims and collapses whitespace", () => {
    expect(formatColorName("  dark   blue ")).toBe("dark blue");
  });

  test("returns empty string for non-strings", () => {
    expect(formatColorName(null)).toBe("");
    expect(formatColorName(42)).toBe("");
  });
});

describe("validateColorName", () => {
  test("accepts a normal color name", () => {
    expect(validateColorName("Sky Blue")).toEqual({ valid: true, error: "" });
  });

  test("rejects an empty or whitespace-only name", () => {
    expect(validateColorName("   ").valid).toBe(false);
    expect(validateColorName("").error).toBe("Color name is required");
  });

  test("rejects names longer than 50 characters", () => {
    expect(validateColorName("a".repeat(51)).valid).toBe(false);
  });

  test("rejects script/HTML characters", () => {
    expect(validateColorName("<script>").valid).toBe(false);
  });
});

describe("isHexColor", () => {
  test.each(["#fff", "#FFFFFF", "abc123"])("%s is a hex color", (value) => {
    expect(isHexColor(value)).toBe(true);
  });

  test.each(["#ffff", "blue", "", "#GGGGGG"])("%s is not a hex color", (value) => {
    expect(isHexColor(value)).toBe(false);
  });
});

describe("validateLoginForm", () => {
  test("valid when both fields are filled", () => {
    expect(validateLoginForm("rickl", "COP4331").valid).toBe(true);
  });

  test("requires a username", () => {
    expect(validateLoginForm("", "pw")).toEqual({ valid: false, error: "Username is required" });
  });

  test("requires a password", () => {
    expect(validateLoginForm("rickl", "")).toEqual({ valid: false, error: "Password is required" });
  });
});

describe("buildSearchPayload", () => {
  test("produces the JSON SearchColors.php expects", () => {
    expect(JSON.parse(buildSearchPayload("  blue ", "3"))).toEqual({ search: "blue", userId: 3 });
  });
});
