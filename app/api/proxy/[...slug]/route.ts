import { BACKEND_BASE_URL } from "@/app/globalVariables/GlobalVariables";
import { NextRequest } from "next/server";

const constructTargetUrl = (slug: string[], searchParams: URLSearchParams) => {
  const path = slug.join("/");
  const query = searchParams.toString();
  const url = `${BACKEND_BASE_URL}/${path}/${query ? `?${query}` : ""}`;
  return url;
};

const handleApiRequest = async (
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> },
  method: string,
) => {
  try {
    const { slug } = await context.params;
    const targetUrl = constructTargetUrl(slug, request.nextUrl.searchParams);

    const hasBody = ["POST", "PATCH", "PUT"].includes(method);

    const requestContentType = request.headers.get("content-type");
    const isMultipart = requestContentType?.includes("multipart/form-data");

    let body: BodyInit | undefined;

    if (hasBody) {
      if (isMultipart) {
        // For file uploads, pass the FormData directly
        body = await request.formData();
      } else {
        // For JSON requests, parse as JSON
        const jsonBody = await request.json().catch(() => null);
        body = jsonBody ? JSON.stringify(jsonBody) : undefined;
      }
    }

    const response = await fetch(targetUrl, {
      method,
      headers: {
        ...Object.fromEntries(request.headers),
      },
      body,
    });
    return response;
  } catch (error) {}
};

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handleApiRequest(request as NextRequest, context, "GET");
}

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handleApiRequest(request as NextRequest, context, "POST");
}
export async function PATCH(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handleApiRequest(request as NextRequest, context, "PATCH");
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handleApiRequest(request as NextRequest, context, "PUT");
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  return handleApiRequest(request as NextRequest, context, "DELETE");
}
