import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const data = await req.json();

        const patient = await prisma.patient.create({
            data,
        });

        return NextResponse.json(patient);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}

export async function GET() {
    const patients = await prisma.patient.findMany({
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(patients);
}