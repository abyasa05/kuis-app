import { handlers } from "@/auth";

// Automatically provides the endpoints:
// /api/auth/signin, /api/auth/signout, /api/auth/session, /api/auth/callback/google
export const { GET, POST } = handlers;