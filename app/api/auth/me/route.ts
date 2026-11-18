import { serverFetch } from "@/app/lib/serverFetch";

export async function GET() {
  try {
    const res = await serverFetch("/auth/me");

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const user = res.json();

    return new Response(JSON.stringify(user));
  } catch (error) {
    return new Response(JSON.stringify({ user: null }));
  }
}
