import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protect all routes except signin and its subroutes
const isProtectedRoute = createRouteMatcher(["/", "/((?!signin).*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is not logged in and trying to access protected route
  // if (!userId && isProtectedRoute(req)) {
  //   return NextResponse.redirect(new URL("/signin", req.url));
  // }

  // // If user is logged in and trying to access signin page, redirect to home
  // if (userId && req.nextUrl.pathname.startsWith("/signin")) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
};
