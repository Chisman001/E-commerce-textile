import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/shop",
    "/shop/(.*)",
    "/cart",
    "/sign-in",
    "/sign-in/(.*)",
    "/sign-up",
    "/sign-up/(.*)",
    "/contact",
    "/shipping",
    "/privacy-policy",
    "/terms-of-service",
    "/return-policy",
    "/api/webhooks/(.*)",
    "/api/debug/(.*)",
    "/api/contact",
    "/api/newsletter",
    "/api/reviews",
  ],
  ignoredRoutes: ["/api/webhooks/(.*)"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
