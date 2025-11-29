import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.user.findUnique({
            where: { id: ctx.user.userId },
            select: {
                name: true,
                country: true,
                email: true,
            },
        });
    }),

    updateProfile: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                country: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.db.user.update({
                where: { id: ctx.user.userId },
                data: {
                    name: input.name,
                    country: input.country,
                },
            });
        }),
});
