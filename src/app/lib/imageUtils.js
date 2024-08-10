export function getBlurDataURL() {
    const blurSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
        </filter>
        <rect width="100%" height="100%" fill="#cccccc" filter="url(#blur)" />
      </svg>
    `;
  
    const toBase64 = (str) =>
      typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str);
  
    return `data:image/svg+xml;base64,${toBase64(blurSvg)}`;
  }