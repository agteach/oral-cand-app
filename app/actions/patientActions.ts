"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

type CreatePatientResult =
    | { success: true; patientId: string }
    | { success: false; error: string };

export async function createPatient(formData: FormData): Promise<CreatePatientResult> {
    const session = await getCurrentSession();
    const patientId = String(formData.get("patientId") ?? "").trim();
    const education = String(formData.get("education") ?? "").trim() || null;
    const cd4Count = String(formData.get("cd4Count") ?? "").trim() || null;
    const viralLoad = String(formData.get("viralLoad") ?? "").trim() || null;
    const lesionType = String(formData.get("lesionType") ?? "").trim() || null;
    const otherLesion = String(formData.get("otherLesion") ?? "").trim() || null;
    const antifungalType = String(formData.get("antifungalType") ?? "").trim() || null;
    const antifungalDuration = String(formData.get("antifungalDuration") ?? "").trim() || null;
    const antibioticsDuration = String(formData.get("antibioticsDuration") ?? "").trim() || null;
    const surgeryDetails = String(formData.get("surgeryDetails") ?? "").trim() || null;
    const comments = String(formData.get("comments") ?? "").trim() || null;

    if (!session?.user?.id) {
        return {
            success: false,
            error: "Your session is missing account details. Please sign out and sign in again.",
        };
    }

    try {
        const patient = await prisma.patient.create({
            data: {
                patientId,
                dateOfExtraction: new Date(formData.get("dateOfExtraction") as string),
                extractor: formData.get("extractor") as string,
                age: parseInt(formData.get("age") as string),
                sex: formData.get("sex") as string,
                education,
                artInitiation: (formData.get("artInitiation") as string) === "Yes",
                artDate: formData.get("artDate") ? new Date(formData.get("artDate") as string) : null,
                cd4Count,
                cd4Date: formData.get("cd4Date") ? new Date(formData.get("cd4Date") as string) : null,
                viralLoad,
                diagnosis: (formData.get("diagnosis") as string) === "Yes",
                diagnosisDate: formData.get("diagnosisDate") ? new Date(formData.get("diagnosisDate") as string) : null,
                lesionType,
                otherLesion,
                antifungalsUsed: (formData.get("antifungalsUsed") as string) === "Yes",
                antifungalType,
                antifungalDuration,
                antibioticsUsed: (formData.get("antibioticsUsed") as string) === "Yes",
                antibioticsDuration,
                surgeryHistory: (formData.get("surgeryHistory") as string) === "Yes",
                surgeryDetails,
                hospitalStayDays: parseInt(formData.get("hospitalStayDays") as string) || 0,
                diabetes: (formData.get("diabetes") as string) === "Yes",
                comments,
                userId: session.user.id,
            },
        });

        revalidatePath("/dashboard/patients");
        return { success: true, patientId: patient.id };
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002" &&
            Array.isArray(error.meta?.target) &&
            error.meta.target.includes("patientId")
        ) {
            return {
                success: false,
                error: `Patient ID "${patientId}" already exists. Please use a different ID.`,
            };
        }

        console.error("Failed to create patient:", error);
        return {
            success: false,
            error: "Failed to save patient data. Please try again.",
        };
    }
}
