"use client";

import Link from "next/link";

type PatientRow = {
    id: string;
    patientId: string;
    dateOfExtraction: string;
    extractor: string;
    age: number;
    sex: string;
    diagnosis: boolean;
    artInitiation: boolean;
    createdAt: string;
};

type PatientsViewProps = {
    patients: PatientRow[];
};

const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(value));

export default function PatientsView({ patients }: PatientsViewProps) {
    return (
        <div className="space-y-5 sm:space-y-6 md:space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Patients</h1>
                    <p className="mt-1 text-sm text-gray-600 sm:text-base">Manage your oral candidiasis patients</p>
                </div>

                <Link
                    href="/dashboard/patients/new"
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 sm:w-auto sm:px-6"
                >
                    + New Patient
                </Link>
            </div>

            <div className="rounded-[1.75rem] border border-gray-100 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8">
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold">Patient List</h2>
                    <p className="text-sm text-gray-500">
                        {patients.length} {patients.length === 1 ? "record" : "records"}
                    </p>
                </div>

                {patients.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-500 sm:py-16 sm:text-base">
                        No patients registered yet.<br />
                        Open `New Patient` to add your first patient.
                    </div>
                ) : (
                    <>
                        <div className="space-y-3 md:hidden">
                            {patients.map((patient) => (
                                <article key={patient.id} className="rounded-2xl border border-gray-200 p-4 shadow-sm">
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{patient.patientId}</p>
                                            <p className="text-sm text-gray-500">{patient.extractor}</p>
                                        </div>
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${patient.diagnosis ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>
                                            {patient.diagnosis ? "Diagnosed" : "No diagnosis"}
                                        </span>
                                    </div>

                                    <dl className="mt-1 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <dt className="text-gray-500">Age</dt>
                                            <dd className="font-medium text-gray-900">{patient.age}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500">Sex</dt>
                                            <dd className="font-medium text-gray-900">{patient.sex}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500">Extraction</dt>
                                            <dd className="font-medium text-gray-900">{formatDate(patient.dateOfExtraction)}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500">ART</dt>
                                            <dd className="font-medium text-gray-900">{patient.artInitiation ? "Yes" : "No"}</dd>
                                        </div>
                                    </dl>
                                </article>
                            ))}
                        </div>

                        <div className="hidden overflow-x-auto md:block">
                            <table className="min-w-full border-separate border-spacing-0">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500">
                                        <th className="border-b border-gray-200 px-4 py-3 font-medium">Patient ID</th>
                                        <th className="border-b border-gray-200 px-4 py-3 font-medium">Extraction Date</th>
                                        <th className="border-b border-gray-200 px-4 py-3 font-medium">Extractor</th>
                                        <th className="border-b border-gray-200 px-4 py-3 font-medium">Age</th>
                                        <th className="border-b border-gray-200 px-4 py-3 font-medium">Sex</th>
                                        <th className="border-b border-gray-200 px-4 py-3 font-medium">Diagnosis</th>
                                        <th className="border-b border-gray-200 px-4 py-3 font-medium">ART</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients.map((patient) => (
                                        <tr key={patient.id} className="text-sm text-gray-700">
                                            <td className="border-b border-gray-100 px-4 py-4 font-semibold text-gray-900">{patient.patientId}</td>
                                            <td className="border-b border-gray-100 px-4 py-4">{formatDate(patient.dateOfExtraction)}</td>
                                            <td className="border-b border-gray-100 px-4 py-4">{patient.extractor}</td>
                                            <td className="border-b border-gray-100 px-4 py-4">{patient.age}</td>
                                            <td className="border-b border-gray-100 px-4 py-4">{patient.sex}</td>
                                            <td className="border-b border-gray-100 px-4 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-medium ${patient.diagnosis ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"}`}>
                                                    {patient.diagnosis ? "Diagnosed" : "No diagnosis"}
                                                </span>
                                            </td>
                                            <td className="border-b border-gray-100 px-4 py-4">{patient.artInitiation ? "Yes" : "No"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
