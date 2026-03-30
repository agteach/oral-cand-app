import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { email?: string; password?: string };
        const email = body.email?.trim().toLowerCase() || "";
        const password = body.password || "";

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({ message: "Account created. You can now sign in." });
    } catch (error) {
        console.error("Failed to register user:", error);
        return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
    }
}
