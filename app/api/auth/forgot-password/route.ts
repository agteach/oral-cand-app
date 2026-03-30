import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resetWindowMs = 1000 * 60 * 30;

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { email?: string };
        const email = body.email?.trim().toLowerCase() || "";

        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }

        const user = await prisma.$queryRaw<Array<{ id: string }>>`
            SELECT id
            FROM "User"
            WHERE email = ${email}
            LIMIT 1
        `;

        if (user.length === 0) {
            return NextResponse.json({
                message: "If the account exists, a reset link has been prepared.",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + resetWindowMs);

        await prisma.$executeRaw`
            UPDATE "User"
            SET "resetPasswordToken" = ${token},
                "resetPasswordExpires" = ${expiresAt}
            WHERE id = ${user[0].id}
        `;

        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const resetUrl = `${baseUrl}/reset-password?token=${token}`;

        return NextResponse.json({
            message: "Password reset requested successfully.",
            resetUrl,
        });
    } catch (error) {
        console.error("Failed to create password reset token:", error);
        return NextResponse.json({ error: "Failed to create reset link." }, { status: 500 });
    }
}
