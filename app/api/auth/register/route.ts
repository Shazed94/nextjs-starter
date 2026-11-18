
import { BACKEND_BASE_URL } from "@/app/globalVariables/GlobalVariables";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch(`${BACKEND_BASE_URL}/auth/registration/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok && data.status !== 201) {
    return Response.json(
      { error: data.message || "Registration failed" },
      { status: res.status },
    );
  }

  // Store tokens if registration returns them
  if (data.access && data.refresh) {
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
  }

  return Response.json(data);
}
