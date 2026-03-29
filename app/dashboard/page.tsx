import { PrismaClient } from "@prisma/client";
import Charts from "@/components/Charts";
import { calculateRisk } from "@/lib/riskScore";
const prisma = new PrismaClient();

export default async function Dashboard() {
    const patients = await prisma.patient.findMany({
        orderBy: { createdAt: "desc" },
    });
    const total = patients.length;

    const candidiasisCount = patients.filter(
        (p) => p.oralCandidiasis
    ).length;

    const prevalence =
        total > 0 ? ((candidiasisCount / total) * 100).toFixed(1) : 0;

    const artCount = patients.filter((p) => p.artInitiated).length;

    const artCoverage =
        total > 0 ? ((artCount / total) * 100).toFixed(1) : 0;

    const avgAge =
        total > 0
            ? (
                patients.reduce((sum, p) => sum + p.age, 0) / total
            ).toFixed(1)
            : 0;

    return (

        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Patient Records</h1>
            <Charts patients={patients} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">Total Patients</p>
                    <p className="text-xl font-bold">{total}</p>
                </div>

                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">Candidiasis Rate</p>
                    <p className="text-xl font-bold">{prevalence}%</p>
                </div>

                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">ART Coverage</p>
                    <p className="text-xl font-bold">{artCoverage}%</p>
                </div>

                <div className="bg-white shadow p-4 rounded">
                    <p className="text-sm text-gray-500">Average Age</p>
                    <p className="text-xl font-bold">{avgAge}</p>
                </div>
            </div>
            <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>

                        <th className="p-2 border">Code</th>
                        <th className="p-2 border">Age</th>
                        <th className="p-2 border">Sex</th>
                        <th className="p-2 border">Candidiasis</th>
                        <th className="p-2 border">ART</th>
                        <th className="p-2 border">Risk %</th>
                    </tr>
                </thead>

                <tbody>
                    {patients.map((p) => (
                        <tr key={p.id}>
                            <td className="p-2 border">{p.patientCode}</td>
                            <td className="p-2 border">{p.age}</td>
                            <td className="p-2 border">{p.sex}</td>
                            <td className="p-2 border">
                                {p.oralCandidiasis ? "Yes" : "No"}
                            </td>
                            <td className="p-2 border">
                                {p.artInitiated ? "Yes" : "No"}
                            </td>
                            <td className="p-2 border">
                                {calculateRisk(p)}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <a
                href="/api/export"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow"
            >
                📥 Download Excel
            </a>
        </div>
    );
}