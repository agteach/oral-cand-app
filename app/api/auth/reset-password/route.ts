import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { token?: string; password?: string };
        const token = body.token?.trim() || "";
        const password = body.password || "";

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
        }

        const user = await prisma.$queryRaw<Array<{ id: string }>>`
            SELECT id
            FROM "User"
            WHERE "resetPasswordToken" = ${token}
              AND "resetPasswordExpires" > NOW()
            LIMIT 1
        `;

        if (user.length === 0) {
            return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.$executeRaw`
            UPDATE "User"
            SET password = ${hashedPassword},
                "resetPasswordToken" = NULL,
                "resetPasswordExpires" = NULL
            WHERE id = ${user[0].id}
        `;

        return NextResponse.json({ message: "Password updated successfully. Redirecting to login..." });
    } catch (error) {
        console.error("Failed to reset password:", error);
        return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
    }
}
