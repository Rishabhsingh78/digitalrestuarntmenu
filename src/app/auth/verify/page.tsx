"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

import { api } from "~/trpc/react";

import { Suspense } from "react";

function VerifyContent() {
    const [otp, setOtp] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const verifyOtp = api.auth.verifyOtp.useMutation({
        onSuccess: (data) => {
            // Set cookie
            document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
            router.push("/dashboard");
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    useEffect(() => {
        if (!email) {
            router.push("/auth/login");
        }
    }, [email, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        verifyOtp.mutate({ email, code: otp });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Verify OTP</CardTitle>
                    <CardDescription>Enter the code sent to {email}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="otp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                One-Time Password
                            </label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={verifyOtp.isPending}>
                            {verifyOtp.isPending ? "Verifying..." : "Verify"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
