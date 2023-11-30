import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req){
        console.log(req.nextUrl.pathname)
        console.log(req.nextauth.token?.role)
        if(req.nextUrl.pathname.startsWith("/CreateUser") && req.nextauth.token?.role != "admin"){
            return NextResponse.rewrite(new URL("/Denied", req.url))
        }
    },{

        callbacks:{
            authorized:({token}) => !!token
        }

    }
)

export const config = {matcher:['/CreateUser']}