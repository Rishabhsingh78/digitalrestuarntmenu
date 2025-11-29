"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export default function DashboardPage() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    // Profile State
    const [userName, setUserName] = useState("");
    const [userCountry, setUserCountry] = useState("");

    const utils = api.useUtils();
    const restaurants = api.restaurant.getAll.useQuery();

    // Fetch profile data
    const userProfile = api.user.getProfile.useQuery();

    useEffect(() => {
        if (userProfile.data) {
            setUserName(userProfile.data.name || "");
            setUserCountry(userProfile.data.country || "");
        }
    }, [userProfile.data]);

    const createRestaurant = api.restaurant.create.useMutation({
        onSuccess: () => {
            setName("");
            setLocation("");
            void utils.restaurant.getAll.invalidate();
        },
    });

    const updateProfile = api.user.updateProfile.useMutation({
        onSuccess: () => {
            void utils.user.getProfile.invalidate();
            alert("Profile updated successfully!");
        },
    });

    const handleCreateRestaurant = (e: React.FormEvent) => {
        e.preventDefault();
        createRestaurant.mutate({ name, location });
    };

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile.mutate({ name: userName, country: userCountry });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-4xl space-y-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>

                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name</label>
                                    <Input
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Country</label>
                                    <Input
                                        value={userCountry}
                                        onChange={(e) => setUserCountry(e.target.value)}
                                        placeholder="India"
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={updateProfile.isPending}>
                                {updateProfile.isPending ? "Saving..." : "Save Profile"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Restaurants Section */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Your Restaurants</h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Restaurant</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateRestaurant} className="space-y-4">
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Restaurant Name"
                                required
                            />
                            <Input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Location"
                                required
                            />
                            <Button type="submit" disabled={createRestaurant.isPending}>
                                Create Restaurant
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                    {restaurants.isLoading ? (
                        <p>Loading...</p>
                    ) : restaurants.data?.length === 0 ? (
                        <p>No restaurants found. Create one!</p>
                    ) : (
                        restaurants.data?.map((restaurant) => (
                            <Link key={restaurant.id} href={`/dashboard/${restaurant.id}`}>
                                <Card className="cursor-pointer transition hover:shadow-lg">
                                    <CardHeader>
                                        <CardTitle>{restaurant.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-500">{restaurant.location}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
