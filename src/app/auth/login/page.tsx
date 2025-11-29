"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const router = useRouter();
    const sendOtp = api.auth.sendOtp.useMutation({
        onSuccess: () => {
            router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        sendOtp.mutate({ email });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your email to receive a one-time password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={sendOtp.isPending}>
                            {sendOtp.isPending ? "Sending..." : "Send OTP"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
