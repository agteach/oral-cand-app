import Link from "next/link";
import PatientForm from "@/components/forms/PatientForm";

export default function NewPatientPage() {
    return (
        <div className="space-y-5 sm:space-y-6 md:space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Patients</p>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">New Patient Form</h1>
                    <p className="mt-1 text-sm text-gray-600 sm:text-base">
                        Complete the data extraction form on its own page for a more focused workflow.
                    </p>
                </div>

                <Link
                    href="/dashboard/patients"
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    Back to Patient List
                </Link>
            </div>

            <PatientForm redirectTo="/dashboard/patients" />
        </div>
    );
}
