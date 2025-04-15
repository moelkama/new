"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface SessionLoadingProps {
    readonly children: React.ReactNode;
}

export default function SessionLoading({ children }: SessionLoadingProps) {
    const { status } = useSession();
    const [showLoader, setShowLoader] = useState(true);

    // Only show loader for a short time to prevent flash
    useEffect(() => {
        if (status !== "loading") {
            setShowLoader(false);
        }
    }, [status]);

    // Add slight delay before showing the loader to prevent flash
    useEffect(() => {
        const timer = setTimeout(() => {
            if (status === "loading") {
                setShowLoader(true);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [status]);

    if (showLoader && status === "loading") {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-t-brand-main border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    <p className="mt-4 text-dark-1 text-body-normal">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}