"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavbarVisibilityProps = {
    children: ReactNode;
};

export default function NavbarVisibility({ children }: NavbarVisibilityProps) {
    const pathname = usePathname();

    if (pathname === "/dashboard/patients/new") {
        return null;
    }

    return <>{children}</>;
}
