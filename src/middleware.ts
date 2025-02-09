import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request as any });
    const url = request.nextUrl;

    if (token) {
        // Redirect authenticated users away from auth pages
        if (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
        ) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    } else {
        // Redirect unauthenticated users trying to access protected routes
        if (url.pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ],
};
