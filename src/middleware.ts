import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value

    // 1. Protect Admin Routes
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next()
        }

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
            const secretKey = process.env.JWT_SECRET || "default_secret_key"
            const key = new TextEncoder().encode(secretKey)
            await jwtVerify(session, key, { algorithms: ['HS256'] })
            return NextResponse.next()
        } catch (error) {
            // Invalid token
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
