import { getCurrentSession } from "@/lib/auth";

export default async function Navbar() {
    const session = await getCurrentSession();

    return (
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 md:px-8">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-600">Oral Candidiasis</p>
                    <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">Dashboard</h2>
                </div>

                <div className="flex min-w-0 items-center gap-3">
                    <div className="min-w-0 text-right">
                        <p className="truncate text-sm font-medium">{session?.user?.name || "Doctor"}</p>
                        <p className="truncate text-xs text-gray-500">{session?.user?.email}</p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                        {(session?.user?.name || "D")[0]}
                    </div>
                </div>
            </div>
        </header>
    );
}
