/* global module */
/*
 * validation.js - pure helper functions used by the COLORS front end.
 *
 * Works in two places:
 *   1. In the browser: load it with <script src="js/validation.js"></script>
 *      BEFORE code.js, and the functions become globals.
 *   2. In Node/Jest: the module.exports block at the bottom lets tests require() it.
 */

/** Trim and collapse internal whitespace: "  dark   blue " -> "dark blue" */
function formatColorName(name) {
  if (typeof name !== "string") return "";
  return name.trim().replace(/\s+/g, " ");
}

/**
 * Validate a color name before sending it to AddColor.php.
 * Returns { valid: boolean, error: string }.
 */
function validateColorName(name) {
  const formatted = formatColorName(name);
  if (formatted.length === 0) {
    return { valid: false, error: "Color name is required" };
  }
  if (formatted.length > 50) {
    return { valid: false, error: "Color name must be 50 characters or fewer" };
  }
  if (!/^[A-Za-z0-9 #-]+$/.test(formatted)) {
    return { valid: false, error: "Color name contains invalid characters" };
  }
  return { valid: true, error: "" };
}

/** True for "#fff", "#FFFFFF", "abc123" style hex colors. */
function isHexColor(value) {
  if (typeof value !== "string") return false;
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

/**
 * Validate the login form. Returns { valid: boolean, error: string }.
 */
function validateLoginForm(login, password) {
  if (typeof login !== "string" || login.trim() === "") {
    return { valid: false, error: "Username is required" };
  }
  if (typeof password !== "string" || password === "") {
    return { valid: false, error: "Password is required" };
  }
  return { valid: true, error: "" };
}

/** Build the JSON body that SearchColors.php expects. */
function buildSearchPayload(search, userId) {
  return JSON.stringify({ search: formatColorName(search), userId: Number(userId) });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    formatColorName,
    validateColorName,
    isHexColor,
    validateLoginForm,
    buildSearchPayload,
  };
}
