// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
	// Check for session cookie
	const sessionCookie = request.cookies.get("better-auth.session_token");
	const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
		request.nextUrl.pathname.startsWith("/register");
	const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard") ||
		request.nextUrl.pathname.startsWith("/projects");

	// Redirect to login if accessing protected page without session
	if (isProtectedPage && !sessionCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Redirect to dashboard if accessing auth pages with session
	if (isAuthPage && sessionCookie) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/projects/:path*",
		"/login",
		"/register",
	],
};