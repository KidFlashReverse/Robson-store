import { NextRequest, NextResponse } from "next/server";
import nookies from 'nookies';

export function middleware(request: NextRequest){
    if(!request.cookies.get('uid')){
        return NextResponse.redirect(new URL('/login', request.url));
    }    
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|404).*)',],
}