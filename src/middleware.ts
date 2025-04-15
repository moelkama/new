import { auth } from "auth";

export default auth((req) => {
  const isAuthenticated = req.auth;
  const isAuthpage = req.nextUrl.pathname.startsWith("/auth");

  const isResetPasswordPage = req.nextUrl.pathname === "/reset-password";

  const isLoginPage = req.nextUrl.pathname === "/auth/login";
  const isSignupPage = req.nextUrl.pathname === "/auth/signup";

  const isImageRequest = /\.(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/i.test(
    req.nextUrl.pathname,
  );

  if (isImageRequest) {
    return;
  }

  if (
    !isAuthenticated &&
    !isAuthpage &&
    !isResetPasswordPage &&
    !isSignupPage
  ) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  if (isAuthenticated && (isLoginPage || isSignupPage)) {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
