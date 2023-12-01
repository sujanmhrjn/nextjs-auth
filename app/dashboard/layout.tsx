import React from 'react'
import AuthProvider from '../(components)/AuthProvider'
import Nav from '../(components)/Nav'
import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import Header from '../(components)/header';


const layout = async ({children}:{children: React.ReactNode}) => {
    const session = await getServerSession(options);
    if(!session) {
        redirect("/api/auth/signin?callbackUrl=/dashboard");
    }
  return (
    <>
        <AuthProvider>
            <div className='flex'>
                <Nav/>
                <div className='px-4 w-full'>
                    <Header/>
                    {children}
                </div>
            </div>
        </AuthProvider>    
    </>
  )
}

export default layout