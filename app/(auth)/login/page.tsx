"use client";
import { signIn } from 'next-auth/react';
import React, { useRef } from 'react'
const Login = () => {
    const userName = useRef("");
    const password = useRef("");

    const onSubmit = async (e:any) => {
        e.preventDefault();
        await signIn("credentials",{
            username: userName.current,
            password: password.current,
            redirect: true,
            callbackUrl: "/dashboard"
        });
    }

    const inputStyle = `border border-gray-300 py-2 px-2 rounded w-full`;
    const bottomStyle = `border border-blue-300 px-6 py-3 rounded  font-bold text-sm uppercase bg-blue-500 text-white hover:bg-blue-400`;
  return (
    <div className="flex items-center h-screen w-full justify-center bg-gray-100">
        <form method="post" onSubmit={onSubmit} className='p-6 w-3/12 shadow-lg bg-white rounded-xl'>
            <h1 className='font-bold text-2xl uppercase'>Login</h1>
            <p className='text-xs  mb-8 text-gray-500'>Login with credentials <b>(username: sujan@gmail.com, password: sujan)</b></p>
            <div className='mb-4'>
                <label>Username</label><br/>
                <input type='text' name='username' placeholder="Enter Username" onChange={(e)=>userName.current = e.target.value} className={inputStyle}/>
            </div>

            <div className='mb-4'>
                <label>Password</label><br/>
                <input type='password' name='password' placeholder="Enter Password"  onChange={(e)=>password.current = e.target.value}  className={inputStyle}/>
            </div>

            <div className=''>
                <button type="submit" className={bottomStyle}>Sign In</button>
            </div>
        </form>
    </div>
  )
}

export default Login