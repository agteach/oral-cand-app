"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";

const inputClassName =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";

type ResetPasswordClientProps = {
    token: string;
};

export default function ResetPasswordClient({ token }: ResetPasswordClientProps) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            setError("Missing or invalid reset token.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
        });

        const payload = (await response.json()) as { error?: string; message?: string };
        setLoading(false);

        if (!response.ok) {
            setError(payload.error || "Unable to reset password.");
            return;
        }

        setSuccess(payload.message || "Password updated successfully.");
        setTimeout(() => router.push("/login"), 1200);
    };

    return (
        <AuthShell
            eyebrow="Set New Password"
            title="Choose a new password"
            description="Enter a new password for your account. This reset link can only be used once."
            footer={
                <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-600">Need to start over?</span>
                    <Link href="/forgot-password" className="font-semibold text-sky-700 transition hover:text-sky-900">
                        Request another link
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

                {!token ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                        This page needs a valid reset token in the URL.
                    </div>
                ) : null}

                <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-800">New Password</span>
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
                    <span className="text-sm font-semibold text-slate-800">Confirm New Password</span>
                    <input
                        type="password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputClassName}
                        minLength={8}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading || !token}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:from-sky-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:from-sky-300 disabled:to-teal-300"
                >
                    {loading ? "Updating password..." : "Reset Password"}
                </button>
            </form>
        </AuthShell>
    );
}
