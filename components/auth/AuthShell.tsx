import type { ReactNode } from "react";
import Link from "next/link";

type AuthShellProps = {
    eyebrow: string;
    title: string;
    description: string;
    children: ReactNode;
    footer?: ReactNode;
};

export default function AuthShell({ eyebrow, title, description, children, footer }: AuthShellProps) {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.28),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(94,234,212,0.18),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#eef6ff_42%,_#f8fafc_100%)] px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur md:grid-cols-[1fr_1.05fr]">
                    <div className="hidden bg-gradient-to-br from-slate-950 via-sky-950 to-teal-900 p-8 text-white md:flex md:flex-col md:justify-between lg:p-10">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-sky-200">
                                Oral Candidiasis
                            </p>
                            <h1 className="mt-5 text-4xl font-bold tracking-tight">Clinical Access Portal</h1>
                            <p className="mt-4 max-w-md text-base leading-7 text-sky-100">
                                Secure mobile-first access for patient intake, reporting, and follow-up records.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5">
                                <p className="text-sm font-semibold text-white">Built for quick clinical workflows</p>
                                <p className="mt-2 text-sm leading-6 text-sky-100">
                                    Sign in, register a team member, or reset access without leaving the app flow.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm font-semibold text-sky-200 transition hover:text-white"
                            >
                                Return to sign in
                            </Link>
                        </div>
                    </div>

                    <div className="p-5 sm:p-8 lg:p-10">
                        <div className="mx-auto w-full max-w-md">
                            <div className="mb-8 md:hidden">
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                                    Oral Candidiasis
                                </p>
                                <p className="mt-2 text-sm text-slate-600">
                                    Secure access for patient intake and reporting.
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                                    {eyebrow}
                                </p>
                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                            </div>

                            <div className="mt-8">{children}</div>

                            {footer ? <div className="mt-6 border-t border-slate-200 pt-5">{footer}</div> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
