import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const menuRouter = createTRPCRouter({
    // --- Categories ---
    createCategory: protectedProcedure
        .input(z.object({ restaurantId: z.string(), name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            // Verify ownership
            const restaurant = await ctx.db.restaurant.findUnique({
                where: { id: input.restaurantId },
            });
            if (!restaurant || restaurant.ownerId !== ctx.user.userId) {
                throw new Error("Unauthorized");
            }

            return ctx.db.category.create({
                data: {
                    name: input.name,
                    restaurantId: input.restaurantId,
                },
            });
        }),

    getCategories: publicProcedure
        .input(z.object({ restaurantId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.category.findMany({
                where: { restaurantId: input.restaurantId },
                include: { dishes: { include: { dish: true } } },
            });
        }),

    // --- Dishes ---
    createDish: protectedProcedure
        .input(
            z.object({
                restaurantId: z.string(),
                name: z.string().min(1),
                description: z.string().optional(),
                price: z.number().min(0),
                image: z.string().optional(),
                spiceLevel: z.string().optional(),
                isVeg: z.boolean(),
                categoryIds: z.array(z.string()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Verify ownership
            const restaurant = await ctx.db.restaurant.findUnique({
                where: { id: input.restaurantId },
            });
            if (!restaurant || restaurant.ownerId !== ctx.user.userId) {
                throw new Error("Unauthorized");
            }

            const dish = await ctx.db.dish.create({
                data: {
                    name: input.name,
                    description: input.description,
                    price: input.price,
                    image: input.image,
                    spiceLevel: input.spiceLevel,
                    isVeg: input.isVeg,
                    restaurantId: input.restaurantId,
                },
            });

            // Link to categories
            if (input.categoryIds && input.categoryIds.length > 0) {
                await ctx.db.dishCategory.createMany({
                    data: input.categoryIds.map((categoryId) => ({
                        dishId: dish.id,
                        categoryId,
                    })),
                });
            }

            return dish;
        }),

    getDishes: publicProcedure
        .input(z.object({ restaurantId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.dish.findMany({
                where: { restaurantId: input.restaurantId },
                include: { categories: { include: { category: true } } },
            });
        }),
});
