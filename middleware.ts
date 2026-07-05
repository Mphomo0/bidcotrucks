export { auth as middleware } from '@/auth'

export const config = {
  // Skip public read-heavy endpoints (featured, filters, category, vehicles).
  // Their mutating handlers already enforce auth via the auth() wrapper, and
  // running middleware on every public GET burns edge/function invocations.
  matcher: ['/api/((?!featured|filters|category|vehicles).*)'],
}
