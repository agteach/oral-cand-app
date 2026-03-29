import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash("admin123", 10);

    await prisma.user.create({
        data: {
            email: "admin@example.com",
            password,
        },
    });

    console.log("Admin user created!");
}

main();