import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getCurrentSession();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        const patient = await prisma.patient.create({
            data: {
                ...data,
                userId: session.user.id,
            },
        });

        return NextResponse.json(patient);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}

export async function GET() {
    const session = await getCurrentSession();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patients = await prisma.patient.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(patients);
}
