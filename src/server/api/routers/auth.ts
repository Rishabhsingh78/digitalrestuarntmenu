import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateOTP } from "~/utils/otp";
import { signJwt } from "~/utils/jwt";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
    sendOtp: publicProcedure
        .input(z.object({ email: z.string().email() }))
        .mutation(async ({ ctx, input }) => {
            const { email } = input;
            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Save OTP to database
            await ctx.db.otpCode.create({
                data: {
                    email,
                    code: otp,
                    expiresAt,
                },
            });

            // TODO: Send email (mock for now)
            console.log(`[MOCK EMAIL] OTP for ${email}: ${otp}`);

            return { success: true };
        }),

    verifyOtp: publicProcedure
        .input(z.object({ email: z.string().email(), code: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { email, code } = input;

            // Find valid OTP
            const otpRecord = await ctx.db.otpCode.findFirst({
                where: {
                    email,
                    code,
                    expiresAt: { gt: new Date() },
                },
            });

            if (!otpRecord) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid or expired OTP",
                });
            }

            // Delete used OTP
            await ctx.db.otpCode.delete({ where: { id: otpRecord.id } });

            // Find or create user
            let user = await ctx.db.user.findUnique({ where: { email } });
            if (!user) {
                user = await ctx.db.user.create({ data: { email } });
            }

            // Generate JWT
            const token = signJwt({ userId: user.id });

            // In a real app, we would set a session cookie here.
            // For this prototype, we'll return the user ID and handle client-side state or use a simple cookie approach if needed.
            // Since we aren't using NextAuth, we might need a custom session solution, but for now let's just return the user.

            return { success: true, userId: user.id, token };
        }),
});
