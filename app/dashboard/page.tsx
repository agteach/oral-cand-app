import { prisma } from "@/lib/prisma";
import Charts from "@/components/Charts";
import { getCurrentSession } from "@/lib/auth";

const formatDate = (value: Date) =>
    new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(value);

export default async function DashboardPage() {
    const session = await getCurrentSession();

    if (!session?.user?.id) {
        return null;
    }

    const userWhere = { userId: session.user.id };

    const [totalPatients, diagnosedCases, newThisMonth, chartPatients, recentPatients] = await Promise.all([
        prisma.patient.count({ where: userWhere }),
        prisma.patient.count({ where: { ...userWhere, diagnosis: true } }),
        prisma.patient.count({
            where: {
                ...userWhere,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        }),
        prisma.patient.findMany({
            where: userWhere,
            select: {
                id: true,
                diagnosis: true,
                artInitiation: true,
            },
        }),
        prisma.patient.findMany({
            where: userWhere,
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                patientId: true,
                extractor: true,
                diagnosis: true,
                createdAt: true,
            },
        }),
    ]);

    const diagnosisRate = totalPatients === 0 ? 0 : Math.round((diagnosedCases / totalPatients) * 100);

    return (
        <div className="space-y-6 md:space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Dashboard
                </h1>
                <p className="mt-2 text-sm text-gray-600 sm:text-base">
                    Live overview of your oral candidiasis patient records
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-sm text-gray-500">Total Patients</p>
                    <p className="mt-2 text-3xl font-bold text-blue-600 sm:text-4xl">{totalPatients}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-sm text-gray-500">Diagnosed Cases</p>
                    <p className="mt-2 text-3xl font-bold text-orange-600 sm:text-4xl">{diagnosedCases}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-sm text-gray-500">New This Month</p>
                    <p className="mt-2 text-3xl font-bold text-green-600 sm:text-4xl">{newThisMonth}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-sm text-gray-500">Diagnosis Rate</p>
                    <p className="mt-2 text-3xl font-bold text-sky-600 sm:text-4xl">{diagnosisRate}%</p>
                </div>
            </div>

            <Charts patients={chartPatients} />

            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent Patients</h2>
                    <p className="text-sm text-gray-500">{recentPatients.length} shown</p>
                </div>

                {recentPatients.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-500 sm:py-16 sm:text-base">
                        No patient records yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentPatients.map((patient) => (
                            <div
                                key={patient.id}
                                className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div>
                                    <p className="text-base font-semibold text-gray-900">{patient.patientId}</p>
                                    <p className="text-sm text-gray-500">
                                        Added on {formatDate(patient.createdAt)} by {patient.extractor}
                                    </p>
                                </div>

                                <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${patient.diagnosis ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>
                                    {patient.diagnosis ? "Diagnosed" : "No diagnosis"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
