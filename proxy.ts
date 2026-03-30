import { withAuth } from "next-auth/middleware";

export default withAuth(
    function proxy() {
        // Reserved for future route-level auth logic.
    },
    {
        pages: {
            signIn: "/login",
        },
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*"],
};
