import { getCurrentSession } from "@/lib/auth";
import UserMenu from "@/components/layout/UserMenu";
import MobileMenuButton from "@/components/layout/MobileMenuButton";
import NavbarVisibility from "@/components/layout/NavbarVisibility";

export default async function Navbar() {
    const session = await getCurrentSession();
    const userName = session?.user?.name || "Doctor";

    return (
        <NavbarVisibility>
            <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
                <div className="px-3 py-3 sm:px-6 sm:py-4 md:px-8">
                    <div className="rounded-[1.6rem] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(248,250,252,0.95),rgba(239,246,255,0.95),rgba(240,253,250,0.9))] px-4 py-4 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.5)] sm:px-5 sm:py-5">
                        <div className="flex items-start justify-between gap-3 sm:items-center">
                            <div className="flex min-w-0 items-start gap-3 sm:items-center">
                                <MobileMenuButton />
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                                    <span className="block">Oral Candidiasis</span>
                                    <span className="mt-2 block text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                                        Clinical Dashboard
                                    </span>
                                    <span className="mt-1 block text-sm normal-case tracking-normal text-slate-600">
                                        Mobile-ready patient management and reporting.
                                    </span>
                                </p>
                            </div>

                            <UserMenu userName={userName} />
                        </div>
                    </div>
                </div>
            </header>
        </NavbarVisibility>
    );
}
