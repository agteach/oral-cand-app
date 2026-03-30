"use client";

import Link from "next/link";
import { useState } from "react";
import AuthShell from "@/components/auth/AuthShell";

const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [resetUrl, setResetUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setResetUrl("");
        setLoading(true);

        const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const payload = (await response.json()) as { error?: string; message?: string; resetUrl?: string };
        setLoading(false);

        if (!response.ok) {
            setError(payload.error || "Unable to start password reset.");
            return;
        }

        setMessage(payload.message || "If the email exists, a reset link has been prepared.");
        setResetUrl(payload.resetUrl || "");
    };

    return (
        <AuthShell
            eyebrow="Password Help"
            title="Reset your password"
            description="Enter the email linked to your account and we will prepare a password reset link."
            footer={
                <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-600">Remembered your password?</span>
                    <Link href="/login" className="font-semibold text-sky-700 transition hover:text-sky-900">
                        Back to login
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

                {message ? (
                    <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        <p>{message}</p>
                        {resetUrl ? (
                            <div className="rounded-xl border border-emerald-200 bg-white px-3 py-3 text-left">
                                <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Reset Link</p>
                                <Link href={resetUrl} className="mt-2 block break-all font-semibold text-sky-700">
                                    {resetUrl}
                                </Link>
                                <p className="mt-2 text-xs text-slate-500">
                                    This link is shown directly because email delivery is not configured yet.
                                </p>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-800">Email</span>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClassName}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:from-sky-300 disabled:to-teal-300"
                >
                    {loading ? "Preparing reset..." : "Send Reset Link"}
                </button>
            </form>
        </AuthShell>
    );
}
