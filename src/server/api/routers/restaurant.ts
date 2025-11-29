import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const restaurantRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({ name: z.string().min(1), location: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.restaurant.create({
                data: {
                    name: input.name,
                    location: input.location,
                    ownerId: ctx.user.userId,
                },
            });
        }),

    getAll: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.restaurant.findMany({
            where: {
                ownerId: ctx.user.userId,
            },
            orderBy: { createdAt: "desc" },
        });
    }),

    getById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.db.restaurant.findFirst({
                where: {
                    id: input.id,
                    ownerId: ctx.user.userId,
                },
            });
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.restaurant.delete({
                where: {
                    id: input.id,
                    ownerId: ctx.user.userId,
                },
            });
        }),
});
