"use client";

export default function MobileMenuButton() {
    const handleClick = () => {
        window.dispatchEvent(new CustomEvent("mobile-nav:open"));
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/95 text-slate-700 shadow-lg shadow-slate-200/70 backdrop-blur transition hover:bg-white md:hidden"
            aria-label="Open navigation menu"
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
            </svg>
        </button>
    );
}
