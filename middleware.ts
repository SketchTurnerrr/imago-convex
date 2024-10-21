import { convexAuthNextjsMiddleware } from '@convex-dev/auth/nextjs/server';

export default convexAuthNextjsMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

// import {
//   convexAuthNextjsMiddleware,
//   createRouteMatcher,
//   isAuthenticatedNextjs,
//   nextjsMiddlewareRedirect,
// } from '@convex-dev/auth/nextjs/server';

// const isSignInPage = createRouteMatcher(['/', '/signup']);
// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// export default convexAuthNextjsMiddleware((request) => {
//   if (isSignInPage(request) && isAuthenticatedNextjs()) {
//     return nextjsMiddlewareRedirect(request, '/dashboard');
//   }
//   if (isProtectedRoute(request) && !isAuthenticatedNextjs()) {
//     return nextjsMiddlewareRedirect(request, '/');
//   }
// });

// export const config = {
//   // The following matcher runs middleware on all routes
//   // except static assets.
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };
