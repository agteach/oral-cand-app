"use client";

import { createPatient } from "@/app/actions/patientActions";
import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

interface PatientFormValues {
    patientId: string;
    dateOfExtraction: string;
    extractor: string;
    age: number | "";
    sex: string;
    education: string;
    artInitiation: string;
    artDate: string;
    cd4Count: string;
    cd4Date: string;
    viralLoad: string;
    diagnosis: string;
    diagnosisDate: string;
    lesionType: string;
    otherLesion: string;
    antifungalsUsed: string;
    antifungalType: string;
    antifungalDuration: string;
    antibioticsUsed: string;
    antibioticsDuration: string;
    surgeryHistory: string;
    surgeryDetails: string;
    hospitalStayDays: number | "";
    diabetes: string;
    comments: string;
}

const createInitialFormData = (): PatientFormValues => ({
    patientId: "",
    dateOfExtraction: new Date().toISOString().split("T")[0],
    extractor: "",
    age: "",
    sex: "",
    education: "",
    artInitiation: "No",
    artDate: "",
    cd4Count: "",
    cd4Date: "",
    viralLoad: "",
    diagnosis: "No",
    diagnosisDate: "",
    lesionType: "",
    otherLesion: "",
    antifungalsUsed: "No",
    antifungalType: "",
    antifungalDuration: "",
    antibioticsUsed: "No",
    antibioticsDuration: "",
    surgeryHistory: "No",
    surgeryDetails: "",
    hospitalStayDays: "",
    diabetes: "No",
    comments: "",
});

type PatientFormProps = {
    onSuccess?: () => void;
    redirectTo?: string;
};

type FieldProps = {
    label: string;
    hint?: string;
    children: ReactNode;
};

type ChoiceProps = {
    checked: boolean;
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const inputClassName =
    "w-full min-w-0 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 hover:border-sky-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

function Field({ label, hint, children }: FieldProps) {
    return (
        <label className="block space-y-2">
            <div>
                <span className="text-sm font-semibold text-slate-800">{label}</span>
                {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
            </div>
            {children}
        </label>
    );
}

function SectionCard({
    eyebrow,
    title,
    description,
    children,
}: {
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-[1.6rem] border border-white/70 bg-white/90 shadow-[0_20px_60px_-35px_rgba(14,116,144,0.45)] backdrop-blur-sm sm:rounded-[2rem]">
            <div className="border-b border-slate-100 bg-gradient-to-r from-sky-50 via-white to-teal-50 px-4 py-4 sm:px-7 sm:py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">{eyebrow}</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">{title}</h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
            </div>
            <div className="space-y-5 px-4 py-5 sm:space-y-6 sm:px-7 sm:py-7">{children}</div>
        </section>
    );
}

function ChoicePill({ checked, label, name, value, onChange }: ChoiceProps) {
    return (
        <label
            className={[
                "flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200",
                checked
                    ? "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-200"
                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50",
            ].join(" ")}
        >
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            {label}
        </label>
    );
}

function InsightBadge({ title, value, tone }: { title: string; value: string; tone: "sky" | "teal" | "amber" }) {
    const tones = {
        sky: "border-sky-200 bg-sky-50 text-sky-700",
        teal: "border-teal-200 bg-teal-50 text-teal-700",
        amber: "border-amber-200 bg-amber-50 text-amber-700",
    };

    return (
        <div className={`rounded-2xl border px-4 py-3 ${tones[tone]}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.22em]">{title}</p>
            <p className="mt-2 text-base font-semibold sm:text-lg">{value}</p>
        </div>
    );
}

export default function PatientForm({ onSuccess, redirectTo }: PatientFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<PatientFormValues>(createInitialFormData);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value === "" ? "" : parseInt(value, 10) || 0) : value,
        }));
    };

    const completion = useMemo(() => {
        const checks = [
            formData.patientId.trim().length > 0,
            formData.extractor.trim().length > 0,
            formData.age !== "" && formData.age > 0,
            formData.sex.length > 0,
            formData.education.length > 0,
            formData.cd4Count.trim().length > 0,
            formData.viralLoad.trim().length > 0,
            formData.comments.trim().length > 0,
        ];

        const done = checks.filter(Boolean).length;
        return Math.round((done / checks.length) * 100);
    }, [formData]);

    const isFormReady =
        formData.patientId.trim().length > 0 &&
        formData.dateOfExtraction.trim().length > 0 &&
        formData.extractor.trim().length > 0 &&
        formData.age !== "" &&
        formData.age > 0 &&
        formData.sex.trim().length > 0;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setErrorMessage("");

        const form = e.currentTarget;
        const submittedFormData = new FormData(form);

        try {
            const result = await createPatient(submittedFormData);

            if (!result.success) {
                setErrorMessage(result.error);
                return;
            }

            setSuccess(true);
            form.reset();
            setFormData(createInitialFormData());
            router.refresh();
            if (redirectTo) {
                router.push(redirectTo);
                return;
            }
            onSuccess?.();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to save patient";
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl rounded-[1.6rem] border border-white/70 bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.22),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-3 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] sm:rounded-[2rem] sm:p-5 lg:p-8">
            <div className="mb-6 overflow-hidden rounded-[1.6rem] border border-sky-100 bg-gradient-to-br from-slate-950 via-sky-950 to-teal-900 text-white shadow-[0_20px_70px_-35px_rgba(8,47,73,0.8)] sm:mb-8 sm:rounded-[2rem]">
                <div className="grid gap-5 px-4 py-5 sm:px-7 sm:py-6 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-8">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-200">Appendix 1</p>
                        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">Data Extraction Form</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-sky-100 sm:text-base">
                            A clearer, faster capture flow for oral candidiasis patient records with guided sections and live visual feedback.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-1">
                        <InsightBadge title="Completion" value={`${completion}% ready`} tone="sky" />
                        <InsightBadge title="Diagnosis" value={formData.diagnosis === "Yes" ? "Positive case" : "Not diagnosed"} tone="amber" />
                        <InsightBadge title="ART Status" value={formData.artInitiation === "Yes" ? "On ART" : "Not on ART"} tone="teal" />
                    </div>
                </div>
                <div className="h-2 w-full bg-white/10">
                    <div
                        className="h-full rounded-r-full bg-gradient-to-r from-sky-300 via-cyan-300 to-teal-300 transition-all duration-500"
                        style={{ width: `${completion}%` }}
                    />
                </div>
            </div>

            {success && (
                <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700 shadow-sm sm:mb-6">
                    Patient data saved successfully.
                </div>
            )}

            {errorMessage && (
                <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700 shadow-sm sm:mb-6">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <SectionCard
                    eyebrow="Patient Record"
                    title="Identity and extraction details"
                    description="Start with the essential record identifiers so the entry is traceable and easy to review later."
                >
                    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
                        <Field label="Patient ID" hint="Use the same unique code used in your study register.">
                            <input
                                type="text"
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="OC-001"
                                required
                            />
                        </Field>

                        <Field label="Date of Extraction" hint="The day this record was captured or reviewed.">
                            <input
                                type="date"
                                name="dateOfExtraction"
                                value={formData.dateOfExtraction}
                                onChange={handleChange}
                                className={inputClassName}
                                required
                            />
                        </Field>

                        <Field label="Extractor Name" hint="Person responsible for entering the record.">
                            <input
                                type="text"
                                name="extractor"
                                value={formData.extractor}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="Dr. Hana"
                                required
                            />
                        </Field>
                    </div>
                </SectionCard>

                <SectionCard
                    eyebrow="Section 1"
                    title="Demographics"
                    description="Capture the baseline demographic profile with cleaner, easier-to-scan inputs."
                >
                    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
                        <Field label="Age (years)" hint="Enter patient age as a whole number.">
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                className={inputClassName}
                                min={0}
                                required
                            />
                        </Field>

                        <Field label="Sex" hint="Select the recorded sex for this patient.">
                            <select name="sex" value={formData.sex} onChange={handleChange} className={inputClassName} required>
                                <option value="">Select sex</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </Field>

                        <Field label="Education" hint="Highest education level documented in the chart.">
                            <select name="education" value={formData.education} onChange={handleChange} className={inputClassName}>
                                <option value="">Select education level</option>
                                <option value="None">None</option>
                                <option value="Primary">Primary</option>
                                <option value="Secondary">Secondary</option>
                                <option value="Higher">Higher</option>
                            </select>
                        </Field>
                    </div>
                </SectionCard>

                <SectionCard
                    eyebrow="Section 2"
                    title="HIV/AIDS information"
                    description="Track ART status and the latest lab values with conditional fields that appear only when they matter."
                >
                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.1fr_1fr]">
                        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4 sm:rounded-3xl sm:p-5">
                            <Field label="ART Initiation" hint="Choose whether the patient has initiated ART.">
                                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                                    <ChoicePill name="artInitiation" value="Yes" label="Yes" checked={formData.artInitiation === "Yes"} onChange={handleChange} />
                                    <ChoicePill name="artInitiation" value="No" label="No" checked={formData.artInitiation === "No"} onChange={handleChange} />
                                </div>
                            </Field>

                            {formData.artInitiation === "Yes" && (
                                <div className="mt-4 rounded-2xl border border-sky-100 bg-white p-4">
                                    <Field label="ART Start Date" hint="Shown only when ART initiation is marked yes.">
                                        <input type="date" name="artDate" value={formData.artDate} onChange={handleChange} className={inputClassName} />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            <Field label="CD4 Count" hint="Latest value on record.">
                                <input
                                    type="text"
                                    name="cd4Count"
                                    value={formData.cd4Count}
                                    onChange={handleChange}
                                    placeholder="cells per mm3"
                                    className={inputClassName}
                                />
                            </Field>

                            <Field label="CD4 Date" hint="Date corresponding to the latest CD4 count.">
                                <input type="date" name="cd4Date" value={formData.cd4Date} onChange={handleChange} className={inputClassName} />
                            </Field>

                            <div className="sm:col-span-2">
                                <Field label="Viral Load" hint="Capture the latest viral load result exactly as documented.">
                                    <input
                                        type="text"
                                        name="viralLoad"
                                        value={formData.viralLoad}
                                        onChange={handleChange}
                                        placeholder="e.g. Undetectable or 540 copies/mL"
                                        className={inputClassName}
                                    />
                                </Field>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    eyebrow="Section 3"
                    title="Oral candidiasis assessment"
                    description="Use the visual diagnosis controls to reveal the clinical details only when a case is confirmed."
                >
                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4 sm:rounded-3xl sm:p-5">
                            <Field label="Diagnosis" hint="Set the current diagnosis status for oral candidiasis.">
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                                    <ChoicePill name="diagnosis" value="Yes" label="Diagnosed" checked={formData.diagnosis === "Yes"} onChange={handleChange} />
                                    <ChoicePill name="diagnosis" value="No" label="Not diagnosed" checked={formData.diagnosis === "No"} onChange={handleChange} />
                                </div>
                            </Field>

                            {formData.diagnosis === "Yes" && (
                                <div className="mt-4 rounded-2xl border border-amber-100 bg-white p-4">
                                    <Field label="Diagnosis Date" hint="Displayed when the patient is marked as diagnosed.">
                                        <input
                                            type="date"
                                            name="diagnosisDate"
                                            value={formData.diagnosisDate}
                                            onChange={handleChange}
                                            className={inputClassName}
                                        />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 sm:space-y-5">
                            <Field label="Lesion Type" hint="Choose the lesion pattern identified in the clinical record.">
                                <select name="lesionType" value={formData.lesionType} onChange={handleChange} className={inputClassName}>
                                    <option value="">Select lesion type</option>
                                    <option value="Pseudomembranous">Pseudomembranous</option>
                                    <option value="Erythematous">Erythematous</option>
                                    <option value="Other">Other</option>
                                </select>
                            </Field>

                            {formData.lesionType === "Other" && (
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                                    <Field label="Other Lesion" hint="Describe the lesion when it does not fit the predefined list.">
                                        <input
                                            type="text"
                                            name="otherLesion"
                                            value={formData.otherLesion}
                                            onChange={handleChange}
                                            placeholder="Specify other lesion"
                                            className={inputClassName}
                                        />
                                    </Field>
                                </div>
                            )}
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    eyebrow="Section 4"
                    title="Risk factors and history"
                    description="The follow-up fields expand only when relevant, keeping the form cleaner and easier to complete."
                >
                    <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
                        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4 sm:rounded-3xl sm:p-5">
                            <Field label="Antifungals Used" hint="Select yes to record treatment type and duration.">
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                                    <ChoicePill name="antifungalsUsed" value="Yes" label="Yes" checked={formData.antifungalsUsed === "Yes"} onChange={handleChange} />
                                    <ChoicePill name="antifungalsUsed" value="No" label="No" checked={formData.antifungalsUsed === "No"} onChange={handleChange} />
                                </div>
                            </Field>

                            {formData.antifungalsUsed === "Yes" && (
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <Field label="Antifungal Type">
                                        <input type="text" name="antifungalType" value={formData.antifungalType} onChange={handleChange} className={inputClassName} />
                                    </Field>
                                    <Field label="Duration">
                                        <input
                                            type="text"
                                            name="antifungalDuration"
                                            value={formData.antifungalDuration}
                                            onChange={handleChange}
                                            placeholder="e.g. 7 days"
                                            className={inputClassName}
                                        />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4 sm:rounded-3xl sm:p-5">
                            <Field label="Broad-Spectrum Antibiotics" hint="Select yes if used recently, then record the duration.">
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                                    <ChoicePill name="antibioticsUsed" value="Yes" label="Yes" checked={formData.antibioticsUsed === "Yes"} onChange={handleChange} />
                                    <ChoicePill name="antibioticsUsed" value="No" label="No" checked={formData.antibioticsUsed === "No"} onChange={handleChange} />
                                </div>
                            </Field>

                            {formData.antibioticsUsed === "Yes" && (
                                <div className="mt-4">
                                    <Field label="Antibiotics Duration">
                                        <input
                                            type="text"
                                            name="antibioticsDuration"
                                            value={formData.antibioticsDuration}
                                            onChange={handleChange}
                                            placeholder="Duration"
                                            className={inputClassName}
                                        />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4 sm:rounded-3xl sm:p-5">
                            <Field label="Surgery History" hint="Record past surgery and reveal details only when needed.">
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                                    <ChoicePill name="surgeryHistory" value="Yes" label="Yes" checked={formData.surgeryHistory === "Yes"} onChange={handleChange} />
                                    <ChoicePill name="surgeryHistory" value="No" label="No" checked={formData.surgeryHistory === "No"} onChange={handleChange} />
                                </div>
                            </Field>

                            {formData.surgeryHistory === "Yes" && (
                                <div className="mt-4">
                                    <Field label="Surgery Details">
                                        <input
                                            type="text"
                                            name="surgeryDetails"
                                            value={formData.surgeryDetails}
                                            onChange={handleChange}
                                            placeholder="Type or date"
                                            className={inputClassName}
                                        />
                                    </Field>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-4 sm:gap-5">
                            <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4 sm:rounded-3xl sm:p-5">
                                <Field label="Hospital Stay (days)" hint="Enter zero if there was no admission history to record.">
                                    <input
                                        type="number"
                                        name="hospitalStayDays"
                                        value={formData.hospitalStayDays}
                                        onChange={handleChange}
                                        className={inputClassName}
                                        min={0}
                                    />
                                </Field>
                            </div>

                            <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4 sm:rounded-3xl sm:p-5">
                                <Field label="Diabetes Mellitus (DM)" hint="Quick yes or no toggle for metabolic comorbidity.">
                                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                                        <ChoicePill name="diabetes" value="Yes" label="Yes" checked={formData.diabetes === "Yes"} onChange={handleChange} />
                                        <ChoicePill name="diabetes" value="No" label="No" checked={formData.diabetes === "No"} onChange={handleChange} />
                                    </div>
                                </Field>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    eyebrow="Section 5"
                    title="Clinical notes"
                    description="Use the notes area for extra context, chart nuances, or anything that may help reporting later."
                >
                    <Field label="Comments / Additional Notes" hint="Optional free-text notes for special findings or missing details.">
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            rows={6}
                            className={`${inputClassName} resize-y`}
                            placeholder="Add any useful clinical notes, context, or observations here."
                        />
                    </Field>
                </SectionCard>

                {isFormReady ? (
                    <div className="sticky bottom-2 z-10 rounded-[1.4rem] border border-slate-200/80 bg-white/95 p-3 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.45)] backdrop-blur sm:bottom-3 sm:rounded-[1.75rem] sm:p-5">
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Ready to save this patient record</p>
                                <p className="text-xs text-slate-500">
                                    Review the highlighted sections, then submit when everything looks complete.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sky-200 transition duration-200 hover:from-sky-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:from-sky-300 disabled:to-teal-300 sm:w-auto"
                            >
                                {loading ? "Saving Patient Data..." : "Save Data Extraction Form"}
                            </button>
                        </div>
                    </div>
                ) : null}
            </form>
        </div>
    );
}
