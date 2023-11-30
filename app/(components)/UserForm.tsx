"use client";


import { useRouter } from "next/navigation";
import React, {useState} from 'react';

const UserForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({name:'', email:'', password:''});

    const [errorMessage, setErrrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const name = e.target.name
        setFormData((prevState)=>({
            ...prevState,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setErrrorMessage("");
        const res =  await fetch("/api/Users", {
            method: "POST",
            body: JSON.stringify({formData})
        })

        if(!res.ok){
            const response = await res.json();
            setErrrorMessage(response.message);
        }else{
            router.refresh();
            router.push("/");
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-3 w-1/2">
                <h1>Create New User</h1>
                <div className="mb-3">
                    <label htmlFor="name">Full Name</label>
                    <input id="name" type="text" name="name" value={formData?.name} required onChange={handleChange} className="m-2 bg-slate-400 rounded"/> 
                </div>
                <div className="mb-3">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" type="text" name="email" value={formData?.email} required onChange={handleChange} className="m-2 bg-slate-400 rounded"/> 
                </div>
                <div className="mb-3">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" name="password" value={formData?.password} required onChange={handleChange} className="m-2 bg-slate-400 rounded"/> 
                </div>
                <div className="">
                    <button type="submit" className="bg-blue-300 hover:bg-blue-100">Create User</button>
                </div>
            </form>
            {errorMessage && <p className="text-red-500 txt-sm">{errorMessage}</p>}
        </>
    )
}

export default UserForm