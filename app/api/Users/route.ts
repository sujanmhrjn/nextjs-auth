import User from "@/app/(models)/User";

import { NextRequest, NextResponse } from "next/server";
import  bcrypt from "bcrypt";

export async function POST(req: NextRequest){
    try{
   
        const body = await req.json();
        const userData =  body.formData

        // confirm data exsists
        if(!userData.email || !userData.password || !userData.name){
            return NextResponse.json(
                { message:'All Fields are required'},
                { status: 400 }
           )
        }

        // check for duplicate emails
        const duplicateEmail = await User.findOne({email: userData.email}).lean().exec();
        if(duplicateEmail) NextResponse.json({messsage: 'Duplicate Email'}, {status: 400});

        const hashPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashPassword

       await User.create(userData);
       return NextResponse.json({messsage: 'User Created'}, {status:201});
    }catch(err){
        console.log(err);
        return NextResponse.json({message: "Error", err}, {status: 500})
    }

}
