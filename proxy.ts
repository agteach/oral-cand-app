import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware() {
        // You can add custom logic here later
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
    matcher: [
        "/dashboard/:path*",     // Protect everything under /dashboard
    ],
};
