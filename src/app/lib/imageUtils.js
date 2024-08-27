/**
 * Generates a data URL for a blurred SVG image.
 *
 * This function creates an SVG with a Gaussian blur filter applied to a grey rectangle.
 * The SVG is then converted to a base64-encoded data URL, which can be used as a
 * placeholder or loading image in various contexts.
 *
 * @function
 * @returns {string} A data URL representing a blurred SVG image
 */
export function getBlurDataURL() {
  const blurSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
        <rect width="100%" height="100%" fill="#cccccc" filter="url(#blur)" />
      </svg>
    `;

  /**
   * Converts a string to base64 encoding.
   *
   * @param {string} str - The string to be converted to base64
   * @returns {string} The base64-encoded string
   */
  const toBase64 = (str) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
}
