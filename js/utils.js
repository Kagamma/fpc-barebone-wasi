/**
 * Get C string's size
 * @param {*} view
 * @param {*} buf PChar
 * @returns PChar's length
 */
export function pcharLen(view, buf) {
  for (let i = 0; i < 1024 * 1024 * 1024; i++) {
    const c = view.getUint8(buf + i);
    if (c === 0) {
      return i;
    }
  }
}

/**
 * Convert C string to JS string
 * @param {*} view
 * @param {*} base Start of buffer
 * @param {*} buf PChar
 * @returns JS string
 */
export function pcharToJSString(view, base, buf, len = -1) {
  const buffer = new Uint8Array(base, buf, len === -1 ? pcharLen(view, buf) : len);
  return new TextDecoder('utf-8').decode(buffer);
}
