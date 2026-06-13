"use client"

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { status, data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router])

    return (
        <div>
            <h1>Please Login</h1>

            <button 
                onClick={() => 
                    signIn('google', {
                        callbackUrl: '/'
                    })
                }
            >
                Login with Google
            </button>
        </div>
    )
}