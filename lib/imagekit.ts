// With Vercel image optimization disabled (images.unoptimized), browsers
// download originals unless we ask ImageKit to resize. This appends an
// ImageKit transformation so images are served resized, compressed, and in
// the best format for the browser (WebP/AVIF).
export function ikUrl(url: string, width: number, quality = 75): string {
  if (!url || !url.includes('ik.imagekit.io')) return url
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}tr=w-${width},q-${quality},f-auto,c-at_max`
}
