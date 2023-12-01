import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req){
        console.log(req.nextUrl)
        console.log(req.nextUrl.pathname)
        console.log('here',req.nextauth.token?.role)
        const roles = ['admin', 'user'];
        const role  = req.nextauth.token?.role as string ?? 'guest' ;
        console.log(roles.includes(role))
        if(req.nextUrl.pathname.startsWith("/dashboard") &&  !roles.includes(role)){
            return NextResponse.rewrite(new URL("/Denied", req.url))
        }
    },{

        callbacks:{
            authorized:({token}) => !!token
        }

    }
)

export const config = {matcher:['/dashboard/:path*']}