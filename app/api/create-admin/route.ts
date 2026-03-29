import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET() {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await prisma.user.upsert({
        where: { email: "admin@example.com" },
        update: {
            password: hashedPassword,
        },
        create: {
            email: "admin@example.com",
            password: hashedPassword,
        },
    });

    return new Response("Admin reset done");
}