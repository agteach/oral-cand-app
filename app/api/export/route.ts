import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
    try {
        const patients = await prisma.patient.findMany({
            orderBy: { createdAt: "desc" },
        });

        const exportRows = patients.map((patient) => ({
            "Patient ID": patient.patientId,
            "Date of Extraction": patient.dateOfExtraction.toISOString().split("T")[0],
            Extractor: patient.extractor,
            Age: patient.age,
            Sex: patient.sex,
            Education: patient.education ?? "",
            "ART Initiation": patient.artInitiation ? "Yes" : "No",
            "ART Date": patient.artDate ? patient.artDate.toISOString().split("T")[0] : "",
            "CD4 Count": patient.cd4Count ?? "",
            "CD4 Date": patient.cd4Date ? patient.cd4Date.toISOString().split("T")[0] : "",
            "Viral Load": patient.viralLoad ?? "",
            Diagnosis: patient.diagnosis ? "Yes" : "No",
            "Diagnosis Date": patient.diagnosisDate ? patient.diagnosisDate.toISOString().split("T")[0] : "",
            "Lesion Type": patient.lesionType ?? "",
            "Other Lesion": patient.otherLesion ?? "",
            "Antifungals Used": patient.antifungalsUsed ? "Yes" : "No",
            "Antifungal Type": patient.antifungalType ?? "",
            "Antifungal Duration": patient.antifungalDuration ?? "",
            "Antibiotics Used": patient.antibioticsUsed ? "Yes" : "No",
            "Antibiotics Duration": patient.antibioticsDuration ?? "",
            "Surgery History": patient.surgeryHistory ? "Yes" : "No",
            "Surgery Details": patient.surgeryDetails ?? "",
            "Hospital Stay Days": patient.hospitalStayDays,
            Diabetes: patient.diabetes ? "Yes" : "No",
            Comments: patient.comments ?? "",
            "Created At": patient.createdAt.toISOString(),
            "Updated At": patient.updatedAt.toISOString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportRows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        }) as Buffer;
        const fileBytes = new Uint8Array(buffer);

        return new Response(fileBytes, {
            headers: {
                "Content-Disposition": 'attachment; filename="patients.xlsx"',
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Failed to export patients:", error);
        return Response.json({ error: "Failed to export patient data." }, { status: 500 });
    }
}
