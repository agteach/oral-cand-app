import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const getCurrentSession = async (): Promise<Session | null> => {
    return getServerSession(authOptions);
};
