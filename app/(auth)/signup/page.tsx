"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";

const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const payload = (await response.json()) as { error?: string; message?: string };
        setLoading(false);

        if (!response.ok) {
            setError(payload.error || "Unable to create account.");
            return;
        }

        setSuccess(payload.message || "Account created successfully.");
        setTimeout(() => router.push("/login"), 1000);
    };

    return (
        <AuthShell
            eyebrow="Create Account"
            title="Register a new user"
            description="Add a new clinician or administrator account so they can access the dashboard securely."
            footer={
                <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-600">Already have an account?</span>
                    <Link href="/login" className="font-semibold text-sky-700 transition hover:text-sky-900">
                        Sign in
                    </Link>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {error ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                        {error}
                    </div>
                ) : null}

                {success ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        {success}
                    </div>
                ) : null}

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-800">Email</span>
                    <input
                        type="email"
                        placeholder="clinician@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClassName}
                        required
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-800">Password</span>
                    <input
                        type="password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClassName}
                        minLength={8}
                        required
                    />
                </label>

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-800">Confirm Password</span>
                    <input
                        type="password"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputClassName}
                        minLength={8}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:from-sky-300 disabled:to-teal-300"
                >
                    {loading ? "Creating account..." : "Create Account"}
                </button>
            </form>
        </AuthShell>
    );
}
