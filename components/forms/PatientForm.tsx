"use client";
import { createPatient } from "@/app/actions/patientActions";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PatientFormValues {
    patientId: string;
    dateOfExtraction: string;
    extractor: string;
    age: number;
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
    hospitalStayDays: number;
    diabetes: string;
    comments: string;
}

const createInitialFormData = (): PatientFormValues => ({
    patientId: "",
    dateOfExtraction: new Date().toISOString().split("T")[0],
    extractor: "",
    age: 0,
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
    hospitalStayDays: 0,
    diabetes: "No",
    comments: "",
});

type PatientFormProps = {
    onSuccess?: () => void;
};

export default function PatientForm({ onSuccess }: PatientFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<PatientFormValues>(createInitialFormData);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseInt(value) || 0 : value,
        }));
    };

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
            onSuccess?.();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to save patient";
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-100 bg-white p-4 shadow-lg sm:p-6 md:p-8 lg:p-10">
            <div className="mb-8 text-center md:mb-10">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Appendix 1: Data Extraction Form</h1>
                <p className="mt-2 text-sm text-gray-600 sm:text-base">Oral Candidiasis Study</p>
            </div>

            {success && (
                <div className="mb-8 rounded-2xl border border-green-400 bg-green-100 p-4 text-center font-medium text-green-700">
                    Patient data saved successfully!
                </div>
            )}

            {errorMessage && (
                <div className="mb-8 rounded-2xl border border-red-300 bg-red-50 p-4 text-center font-medium text-red-700">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Patient ID</label>
                        <input type="text" name="patientId" value={formData.patientId} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none" required />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Date of Extraction</label>
                        <input type="date" name="dateOfExtraction" value={formData.dateOfExtraction} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3" required />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Extractor Name</label>
                        <input type="text" name="extractor" value={formData.extractor} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3" required />
                    </div>
                </div>

                <div>
                    <h2 className="mb-4 border-b pb-2 text-lg font-semibold sm:mb-6 sm:text-xl">1. Demographics</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium">Age (years)</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3" required />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Sex</label>
                            <select name="sex" value={formData.sex} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3" required>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium">Education</label>
                            <select name="education" value={formData.education} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3">
                                <option value="">Select</option>
                                <option value="None">None</option>
                                <option value="Primary">Primary</option>
                                <option value="Secondary">Secondary</option>
                                <option value="Higher">Higher</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="mb-4 border-b pb-2 text-lg font-semibold sm:mb-6 sm:text-xl">2. HIV/AIDS Information</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        <div>
                            <label className="mb-3 block text-sm font-medium">ART Initiation</label>
                            <div className="flex flex-wrap gap-4 sm:gap-6">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="artInitiation" value="Yes" checked={formData.artInitiation === "Yes"} onChange={handleChange} />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="artInitiation" value="No" checked={formData.artInitiation === "No"} onChange={handleChange} />
                                    No
                                </label>
                            </div>
                            {formData.artInitiation === "Yes" && (
                                <input type="date" name="artDate" value={formData.artDate} onChange={handleChange} className="mt-3 w-full rounded-2xl border border-gray-300 px-4 py-3" />
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium">CD4 Count (latest)</label>
                                <input type="text" name="cd4Count" value={formData.cd4Count} onChange={handleChange} placeholder="cells per mm3" className="w-full rounded-2xl border border-gray-300 px-4 py-3" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">CD4 Date</label>
                                <input type="date" name="cd4Date" value={formData.cd4Date} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Viral Load (latest)</label>
                            <input type="text" name="viralLoad" value={formData.viralLoad} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3" />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="mb-4 border-b pb-2 text-lg font-semibold sm:mb-6 sm:text-xl">3. Oral Candidiasis</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                        <div>
                            <label className="mb-3 block text-sm font-medium">Diagnosis</label>
                            <div className="flex flex-wrap gap-4 sm:gap-6">
                                <label><input type="radio" name="diagnosis" value="Yes" checked={formData.diagnosis === "Yes"} onChange={handleChange} /> Yes</label>
                                <label><input type="radio" name="diagnosis" value="No" checked={formData.diagnosis === "No"} onChange={handleChange} /> No</label>
                            </div>
                            {formData.diagnosis === "Yes" && (
                                <input type="date" name="diagnosisDate" value={formData.diagnosisDate} onChange={handleChange} className="mt-3 w-full rounded-2xl border border-gray-300 px-4 py-3" />
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">Lesion Type</label>
                            <select name="lesionType" value={formData.lesionType} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3">
                                <option value="">Select Lesion Type</option>
                                <option value="Pseudomembranous">Pseudomembranous</option>
                                <option value="Erythematous">Erythematous</option>
                                <option value="Other">Other</option>
                            </select>
                            {formData.lesionType === "Other" && (
                                <input type="text" name="otherLesion" value={formData.otherLesion} onChange={handleChange} placeholder="Specify other lesion" className="mt-3 w-full rounded-2xl border border-gray-300 px-4 py-3" />
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="mb-4 border-b pb-2 text-lg font-semibold sm:mb-6 sm:text-xl">4. Risk Factors</h2>
                    <div className="space-y-6 md:space-y-8">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
                            <div>
                                <label className="mb-3 block text-sm font-medium">Antifungals Used</label>
                                <div className="flex flex-wrap gap-4 sm:gap-6">
                                    <label><input type="radio" name="antifungalsUsed" value="Yes" checked={formData.antifungalsUsed === "Yes"} onChange={handleChange} /> Yes</label>
                                    <label><input type="radio" name="antifungalsUsed" value="No" checked={formData.antifungalsUsed === "No"} onChange={handleChange} /> No</label>
                                </div>
                            </div>
                            {formData.antifungalsUsed === "Yes" && (
                                <>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Type</label>
                                        <input type="text" name="antifungalType" value={formData.antifungalType} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Duration</label>
                                        <input type="text" name="antifungalDuration" value={formData.antifungalDuration} onChange={handleChange} placeholder="e.g. 7 days" className="w-full rounded-2xl border border-gray-300 px-4 py-3" />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                            <div>
                                <label className="mb-3 block text-sm font-medium">Broad-Spectrum Antibiotics</label>
                                <div className="flex flex-wrap gap-4 sm:gap-6">
                                    <label><input type="radio" name="antibioticsUsed" value="Yes" checked={formData.antibioticsUsed === "Yes"} onChange={handleChange} /> Yes</label>
                                    <label><input type="radio" name="antibioticsUsed" value="No" checked={formData.antibioticsUsed === "No"} onChange={handleChange} /> No</label>
                                </div>
                                {formData.antibioticsUsed === "Yes" && (
                                    <input type="text" name="antibioticsDuration" value={formData.antibioticsDuration} onChange={handleChange} placeholder="Duration" className="mt-3 w-full rounded-2xl border border-gray-300 px-4 py-3" />
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium">Hospital Stay (days)</label>
                                <input type="number" name="hospitalStayDays" value={formData.hospitalStayDays} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-4 py-3" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                            <div>
                                <label className="mb-3 block text-sm font-medium">Surgery History</label>
                                <div className="flex flex-wrap gap-4 sm:gap-6">
                                    <label><input type="radio" name="surgeryHistory" value="Yes" checked={formData.surgeryHistory === "Yes"} onChange={handleChange} /> Yes</label>
                                    <label><input type="radio" name="surgeryHistory" value="No" checked={formData.surgeryHistory === "No"} onChange={handleChange} /> No</label>
                                </div>
                                {formData.surgeryHistory === "Yes" && (
                                    <input type="text" name="surgeryDetails" value={formData.surgeryDetails} onChange={handleChange} placeholder="Type/Date" className="mt-3 w-full rounded-2xl border border-gray-300 px-4 py-3" />
                                )}
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-medium">Diabetes Mellitus (DM)</label>
                                <div className="flex flex-wrap gap-4 sm:gap-6">
                                    <label><input type="radio" name="diabetes" value="Yes" checked={formData.diabetes === "Yes"} onChange={handleChange} /> Yes</label>
                                    <label><input type="radio" name="diabetes" value="No" checked={formData.diabetes === "No"} onChange={handleChange} /> No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">Comments / Additional Notes</label>
                    <textarea name="comments" value={formData.comments} onChange={handleChange} rows={5} className="w-full resize-y rounded-3xl border border-gray-300 px-4 py-3" />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-3xl bg-blue-600 py-4 text-base font-semibold text-white transition-all hover:bg-blue-700 disabled:bg-blue-400 sm:py-5 sm:text-lg"
                >
                    {loading ? "Saving Patient Data..." : "Save Data Extraction Form"}
                </button>
            </form>
        </div>
    );
}
