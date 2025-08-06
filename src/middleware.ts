import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Match all pages except static assets
    '/((?!_next|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
};
