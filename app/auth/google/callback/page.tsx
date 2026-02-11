"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get("token");
        const errorParam = searchParams.get("error");

        if (token) {
            localStorage.setItem("auth_token", token);
            // Optional: Fetch user data here or let dashboard handle it
            router.replace("/dashboard");
        } else if (errorParam) {
            setError("Google authentication failed. Please try again.");
            setTimeout(() => router.replace("/login"), 3000);
        } else {
            setError("No token received.");
            setTimeout(() => router.replace("/login"), 3000);
        }
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 p-4">
                <p className="text-red-600 mb-4">{error}</p>
                <p className="text-muted-foreground">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-background">
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <Heart className="w-16 h-16 text-primary fill-primary" />
            </motion.div>
            <p className="mt-8 text-lg text-muted-foreground animate-pulse">
                Completing secure sign in...
            </p>
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
