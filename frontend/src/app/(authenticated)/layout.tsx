import React from "react"
import axios from "axios";
import { fetcher } from "@/lib/fetchers"
import { cookies } from "next/headers"

export default async function Layout({ children }: { children: React.ReactNode }) {

    // get current cookies
    const jwtCookie = cookies().get('Token');
    const refreshToken = cookies().get('Refresh-Token');

    try {
        const res = await fetcher('http://backend:4000/api/authenticate')
        const data = await res.json()
        console.log("🚀 ~ Layout ~ data:", data-data)
    } catch (error) {
        console.error(error.message);
    }

    return (
        <div>
            {children}
        </div>
    )
}