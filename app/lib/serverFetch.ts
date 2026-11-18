import { cookies } from "next/headers";
import { BACKEND_BASE_URL } from "../globalVariables/GlobalVariables";

export async function serverFetch(url: string, options: RequestInit={}) {
  const cookiestore = await cookies();
  const access = cookiestore.get("access")?.value;
  const refresh = cookiestore.get("refresh")?.value;

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${access}`,
    },
  });

  if (res.status === 401 && refresh) {
    const refreshRes = await fetch(`${BACKEND_BASE_URL}/api/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!refreshRes.ok) {
      cookiestore.delete("access");
      cookiestore.delete("refresh");
      throw new Error("Session expired");
    }
    const refreshData = await refreshRes.json();
    const newAccess = refreshData.access;

    cookiestore.set("access", newAccess, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 1,
    });
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newAccess}`,
      },
    });

    // Handle token refresh logic here if needed
  }
  return res;
}
