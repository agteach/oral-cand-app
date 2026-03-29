"use client";

import { useState } from "react";

export default function PatientForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const formData = new FormData(e.target);

        const data = {
            patientCode: formData.get("patientCode"),
            age: Number(formData.get("age")),
            sex: formData.get("sex"),
            artInitiated: formData.get("artInitiated") === "on",
            oralCandidiasis: formData.get("oralCandidiasis") === "on",
            antifungalUsed: formData.get("antifungalUsed") === "on",
        };

        try {
            const res = await fetch("/api/patients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setMessage("✅ Saved successfully");
                e.target.reset();
            } else {
                setMessage("❌ Failed to save");
            }
        } catch (err) {
            setMessage("❌ Error occurred");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-md">
            <h2 className="text-xl font-bold">Add Patient</h2>

            <input name="patientCode" placeholder="Patient Code" required className="border p-2 w-full" />
            <input name="age" type="number" placeholder="Age" required className="border p-2 w-full" />

            <select name="sex" className="border p-2 w-full">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>

            <label>
                <input type="checkbox" name="artInitiated" /> ART Initiated
            </label>

            <label>
                <input type="checkbox" name="oralCandidiasis" /> Oral Candidiasis
            </label>

            <label>
                <input type="checkbox" name="antifungalUsed" /> Antifungal Used
            </label>

            <button disabled={loading} className="bg-blue-600 text-white px-4 py-2">
                {loading ? "Saving..." : "Save"}
            </button>

            <p>{message}</p>
        </form>
    );
}