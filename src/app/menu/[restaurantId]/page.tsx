"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Card, CardContent } from "~/components/ui/card";
import { useEffect, useState } from "react";

export default function PublicMenuPage() {
    const params = useParams();
    const restaurantId = params.restaurantId as string;

    const categories = api.menu.getCategories.useQuery({ restaurantId });
    const allDishes = api.menu.getDishes.useQuery({ restaurantId });
    const [activeCategory, setActiveCategory] = useState<string>("");

    // Combine categories with uncategorized dishes
    const menuSections = [
        ...(categories.data || []),
        {
            id: "uncategorized",
            name: "Other Items",
            dishes: (allDishes.data || [])
                .filter((d) => d.categories.length === 0)
                .map((d) => ({ dish: d })),
        },
    ].filter((section) => section.dishes.length > 0);

    // Scroll spy to update active category
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section");
            let current = "";
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 150) {
                    current = section.getAttribute("id") || "";
                }
            });
            setActiveCategory(current);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToCategory = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: "smooth",
            });
        }
    };

    if (categories.isLoading || allDishes.isLoading) return <div className="p-8 text-center">Loading menu...</div>;
    if (menuSections.length === 0) return <div className="p-8 text-center">Menu not available. Please add categories and dishes in the dashboard.</div>;

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Sticky Header / Navigation */}
            <div className="sticky top-0 z-50 bg-white shadow-sm">
                <div className="flex overflow-x-auto p-4 no-scrollbar">
                    <div className="flex space-x-4">
                        {menuSections.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => scrollToCategory(category.id)}
                                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeCategory === category.id
                                    ? "bg-black text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Content */}
            <div className="mx-auto max-w-2xl p-4 space-y-8">
                {menuSections.map((category) => (
                    <section key={category.id} id={category.id} className="scroll-mt-32">
                        {/* Sticky Category Header */}
                        <div className="sticky top-[72px] z-40 mb-4 border-b bg-gray-50/95 pb-2 pt-2 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
                                <span className="text-sm text-gray-500">{category.dishes.length} items</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {category.dishes.map(({ dish }) => (
                                <div key={dish.id} className="flex justify-between border-b pb-6 last:border-0">
                                    <div className="flex-1 pr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            {/* Veg/Non-Veg Icon */}
                                            <div className={`flex h-4 w-4 items-center justify-center border ${dish.isVeg ? "border-green-600" : "border-red-600"}`}>
                                                <div className={`h-2 w-2 rounded-full ${dish.isVeg ? "bg-green-600" : "bg-red-600"}`} />
                                            </div>

                                            {/* Spice Level */}
                                            {dish.spiceLevel && (
                                                <div className="flex items-center gap-0.5">
                                                    <span className="text-xs text-red-500">🌶️ {dish.spiceLevel}</span>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-800">{dish.name}</h3>
                                        <p className="text-sm font-semibold text-gray-700 mt-1">₹ {dish.price}</p>
                                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{dish.description}</p>
                                    </div>

                                    <div className="relative h-28 w-28 flex-shrink-0">
                                        {dish.image ? (
                                            <img src={dish.image} alt={dish.name} className="h-full w-full rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                        {/* Add Button Overlay (Mock) */}
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                                            <button className="rounded bg-white px-4 py-1 text-sm font-bold text-green-600 shadow-md border border-gray-200 uppercase">
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {category.dishes.length === 0 && (
                                <p className="text-sm text-gray-400 italic">No dishes in this category.</p>
                            )}
                        </div>
                    </section>
                ))}
            </div>

            {/* Floating Menu Button */}
            <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                    <span className="text-lg">🍽️</span>
                    <span className="font-bold">Browse Menu</span>
                </button>
            </div>

            {/* Menu Modal/Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold">Menu Categories</h3>
                            <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {menuSections.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        scrollToCategory(category.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className="rounded-lg border p-3 text-left hover:bg-gray-50 active:bg-gray-100"
                                >
                                    <span className="font-medium">{category.name}</span>
                                    <span className="ml-2 text-xs text-gray-400">({category.dishes.length})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
