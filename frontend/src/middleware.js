import { NextResponse } from 'next/server';
 
export default async function middleware(req) {
    const session = await getSession(req);
    if (session == null){
        return NextResponse.redirect(new URL('/auth', req.nextUrl));
    }

    return NextResponse.next();
}

async function getSession(req) {
    const sessionToken = req.cookies.get("session")?.value;
    if (!sessionToken) return null;

    try {
        const response = await fetch(`${process.env.BACKEND_URL}/auth/session`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionToken}`,
            },
        });
        if (!response.ok) {
            console.error('Error fetching session:', response.statusText);
            return null;
        }

        const session = await response.json();
        return session;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}


export const config = {
    matcher: ["/", "/profile", "/proxy/:path*", "/flow/:path*"],
};