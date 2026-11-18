
import { BACKEND_BASE_URL } from "@/app/globalVariables/GlobalVariables";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const routeName = `${BACKEND_BASE_URL}/auth/login/`;

  const res = await fetch(routeName, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const data = await res.json();

  // ✅ IMPORTANT: await
  const cookieStore = await cookies();

  cookieStore.set("access", data.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 1,
  });

  cookieStore.set("refresh", data.refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return Response.json({ success: true });
}
