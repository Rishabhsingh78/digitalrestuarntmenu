"use client";

import { QRCodeSVG } from "qrcode.react";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";

export default function RestaurantDashboard() {
    const params = useParams();
    const restaurantId = params.restaurantId as string;

    const [newCategoryName, setNewCategoryName] = useState("");
    const [newDishName, setNewDishName] = useState("");
    const [newDishDesc, setNewDishDesc] = useState("");
    const [newDishPrice, setNewDishPrice] = useState("");
    const [newDishSpice, setNewDishSpice] = useState("");
    const [isVeg, setIsVeg] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const utils = api.useUtils();
    const categories = api.menu.getCategories.useQuery({ restaurantId });
    const dishes = api.menu.getDishes.useQuery({ restaurantId });

    const createCategory = api.menu.createCategory.useMutation({
        onSuccess: () => {
            setNewCategoryName("");
            void utils.menu.getCategories.invalidate();
        },
    });

    const createDish = api.menu.createDish.useMutation({
        onSuccess: () => {
            setNewDishName("");
            setNewDishDesc("");
            setNewDishPrice("");
            setNewDishSpice("");
            setIsVeg(true);
            void utils.menu.getDishes.invalidate();
            void utils.menu.getCategories.invalidate();
        },
    });

    const handleCreateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        createCategory.mutate({ restaurantId, name: newCategoryName });
    };

    const handleCreateDish = (e: React.FormEvent) => {
        e.preventDefault();
        createDish.mutate({
            restaurantId,
            name: newDishName,
            description: newDishDesc,
            price: parseFloat(newDishPrice) || 0,
            spiceLevel: newDishSpice,
            isVeg,
            categoryIds: selectedCategory ? [selectedCategory] : [],
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Categories Section */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Categories</h2>
                        <Card>
                            <CardHeader>
                                <CardTitle>Add Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateCategory} className="flex gap-2">
                                    <Input
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="e.g. Starters"
                                        required
                                    />
                                    <Button type="submit" disabled={createCategory.isPending}>
                                        Add
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-2">
                            {categories.data?.map((category) => (
                                <Card key={category.id}>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold">{category.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {category.dishes.length} dishes
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Dishes Section */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">Dishes</h2>
                        <Card>
                            <CardHeader>
                                <CardTitle>Add Dish</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateDish} className="space-y-4">
                                    <Input
                                        value={newDishName}
                                        onChange={(e) => setNewDishName(e.target.value)}
                                        placeholder="Dish Name"
                                        required
                                    />
                                    <Input
                                        value={newDishDesc}
                                        onChange={(e) => setNewDishDesc(e.target.value)}
                                        placeholder="Description"
                                    />
                                    <div className="flex gap-4">
                                        <Input
                                            type="number"
                                            value={newDishPrice}
                                            onChange={(e) => setNewDishPrice(e.target.value)}
                                            placeholder="Price (₹)"
                                            required
                                        />
                                        <div className="flex items-center space-x-2 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                id="isVeg"
                                                checked={isVeg}
                                                onChange={(e) => setIsVeg(e.target.checked)}
                                                className="h-4 w-4"
                                            />
                                            <label htmlFor="isVeg" className="text-sm font-medium">
                                                Veg?
                                            </label>
                                        </div>
                                    </div>
                                    <Input
                                        value={newDishSpice}
                                        onChange={(e) => setNewDishSpice(e.target.value)}
                                        placeholder="Spice Level (e.g. Medium)"
                                    />
                                    <select
                                        className="w-full rounded-md border p-2"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">Select Category (Optional)</option>
                                        {categories.data?.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Button type="submit" className="w-full" disabled={createDish.isPending}>
                                        Add Dish
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="space-y-2">
                            {dishes.data?.map((dish) => (
                                <Card key={dish.id}>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold">{dish.name}</h3>
                                        <p className="text-sm text-gray-600">{dish.description}</p>
                                        {dish.spiceLevel && (
                                            <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                                                {dish.spiceLevel}
                                            </span>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Digital Menu QR Code</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4">
                                <div className="rounded-lg border p-4 bg-white">
                                    {origin && (
                                        <QRCodeSVG
                                            value={`${origin}/menu/${restaurantId}`}
                                            size={200}
                                            level="H"
                                            includeMargin
                                        />
                                    )}
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-gray-500 mb-2">Scan to view menu</p>
                                    <a
                                        href={`/menu/${restaurantId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Open Public Menu Link
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
