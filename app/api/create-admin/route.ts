import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET() {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const existing = await prisma.user.findUnique({
        where: { email: "admin@example.com" },
    });

    if (existing) {
        return new Response("Admin already exists");
    }

    await prisma.user.create({
        data: {
            email: "admin@example.com",
            password: hashedPassword,
        },
    });

    return new Response("Admin created");
}