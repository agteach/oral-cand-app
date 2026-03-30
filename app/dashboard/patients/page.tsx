import { prisma } from "@/lib/prisma";
import PatientsView from "@/components/patients/PatientsView";

export default async function PatientsPage() {
    const patients = await prisma.patient.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            patientId: true,
            dateOfExtraction: true,
            extractor: true,
            age: true,
            sex: true,
            diagnosis: true,
            artInitiation: true,
            createdAt: true,
        },
    });

    const serializedPatients = patients.map((patient) => ({
        ...patient,
        dateOfExtraction: patient.dateOfExtraction.toISOString(),
        createdAt: patient.createdAt.toISOString(),
    }));

    return <PatientsView patients={serializedPatients} />;
}
