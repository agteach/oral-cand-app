import { prisma } from "@/lib/prisma";

type Bucket = {
    label: string;
    value: number;
};

const monthFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
});

const createPercentage = (value: number, total: number) => {
    if (total === 0) {
        return 0;
    }

    return Math.round((value / total) * 100);
};

const groupByAge = (ages: number[]): Bucket[] => {
    const buckets = [
        { label: "Under 20", min: 0, max: 19 },
        { label: "20-29", min: 20, max: 29 },
        { label: "30-39", min: 30, max: 39 },
        { label: "40-49", min: 40, max: 49 },
        { label: "50+", min: 50, max: Number.POSITIVE_INFINITY },
    ];

    return buckets.map((bucket) => ({
        label: bucket.label,
        value: ages.filter((age) => age >= bucket.min && age <= bucket.max).length,
    }));
};

const groupByMonth = (dates: Date[]): Bucket[] => {
    const counts = new Map<string, number>();

    dates.forEach((date) => {
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return Array.from(counts.entries())
        .sort(([left], [right]) => left.localeCompare(right))
        .slice(-6)
        .map(([key, value]) => {
            const [year, month] = key.split("-");
            return {
                label: monthFormatter.format(new Date(Number(year), Number(month), 1)),
                value,
            };
        });
};

function MetricBar({ item, total, tone }: { item: Bucket; total: number; tone: "blue" | "green" | "orange" }) {
    const widths = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        orange: "bg-orange-500",
    };

    const percentage = createPercentage(item.value, total);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="text-gray-500">
                    {item.value} ({percentage}%)
                </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
                <div
                    className={`h-2 rounded-full ${widths[tone]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default async function ReportsPage() {
    const patients = await prisma.patient.findMany({
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            age: true,
            sex: true,
            diagnosis: true,
            artInitiation: true,
            diabetes: true,
            antifungalsUsed: true,
            antibioticsUsed: true,
            createdAt: true,
        },
    });

    const totalPatients = patients.length;
    const diagnosedCases = patients.filter((patient) => patient.diagnosis).length;
    const artPatients = patients.filter((patient) => patient.artInitiation).length;
    const diabetesCases = patients.filter((patient) => patient.diabetes).length;
    const antibioticsCases = patients.filter((patient) => patient.antibioticsUsed).length;
    const antifungalsCases = patients.filter((patient) => patient.antifungalsUsed).length;
    const femalePatients = patients.filter((patient) => patient.sex === "Female").length;
    const malePatients = patients.filter((patient) => patient.sex === "Male").length;

    const ageBuckets = groupByAge(patients.map((patient) => patient.age));
    const monthlyBuckets = groupByMonth(patients.map((patient) => patient.createdAt));
    const sexBuckets: Bucket[] = [
        { label: "Female", value: femalePatients },
        { label: "Male", value: malePatients },
    ];
    const riskBuckets: Bucket[] = [
        { label: "On ART", value: artPatients },
        { label: "Diabetes", value: diabetesCases },
        { label: "Antibiotics Used", value: antibioticsCases },
        { label: "Antifungals Used", value: antifungalsCases },
    ];

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Reports & Analytics</h1>
                    <p className="mt-2 text-sm text-gray-600 sm:text-base">Live reporting summary for your patient records</p>
                </div>

                <a
                    href="/api/export"
                    download
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-600 px-6 py-4 font-medium text-white transition hover:bg-green-700 sm:w-auto sm:px-8"
                >
                    Download Excel Report
                </a>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-sm text-gray-500">Total Records</p>
                    <p className="mt-2 text-3xl font-bold text-blue-600 sm:text-4xl">{totalPatients}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-sm text-gray-500">Diagnosed Cases</p>
                    <p className="mt-2 text-3xl font-bold text-orange-600 sm:text-4xl">{diagnosedCases}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-sm text-gray-500">On ART</p>
                    <p className="mt-2 text-3xl font-bold text-green-600 sm:text-4xl">{artPatients}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                    <p className="text-sm text-gray-500">Diagnosis Rate</p>
                    <p className="mt-2 text-3xl font-bold text-sky-600 sm:text-4xl">
                        {createPercentage(diagnosedCases, totalPatients)}%
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-8">
                <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                    <h2 className="mb-6 text-xl font-semibold">Cases by Age Group</h2>
                    <div className="space-y-4">
                        {ageBuckets.map((item) => (
                            <MetricBar key={item.label} item={item} total={totalPatients} tone="blue" />
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                    <h2 className="mb-6 text-xl font-semibold">Monthly Intake Trend</h2>
                    <div className="space-y-4">
                        {monthlyBuckets.length === 0 ? (
                            <div className="py-10 text-center text-sm text-gray-500">No patient data available yet.</div>
                        ) : (
                            monthlyBuckets.map((item) => (
                                <MetricBar key={item.label} item={item} total={Math.max(...monthlyBuckets.map((bucket) => bucket.value))} tone="green" />
                            ))
                        )}
                    </div>
                </section>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-8">
                <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                    <h2 className="mb-6 text-xl font-semibold">Sex Distribution</h2>
                    <div className="space-y-4">
                        {sexBuckets.map((item) => (
                            <MetricBar key={item.label} item={item} total={totalPatients} tone="orange" />
                        ))}
                    </div>
                </section>

                <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8">
                    <h2 className="mb-6 text-xl font-semibold">Clinical Risk Indicators</h2>
                    <div className="space-y-4">
                        {riskBuckets.map((item) => (
                            <MetricBar key={item.label} item={item} total={totalPatients} tone="blue" />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
