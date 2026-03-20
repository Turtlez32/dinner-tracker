import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.DINNER_API_BASE ?? "https://api.turtleware.au";
const API_KEY = process.env.DINNER_API_KEY ?? "";

function buildUpstreamUrl(req: NextRequest, segments: string[]): string {
  const path = segments.join("/");
  const search = req.nextUrl.search;
  return `${API_BASE}/dinner/${path}${search}`;
}

async function proxy(req: NextRequest, segments: string[]): Promise<NextResponse> {
  const url = buildUpstreamUrl(req, segments);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY
  };

  const body =
    req.method !== "GET" && req.method !== "DELETE"
      ? await req.text()
      : undefined;

  const upstream = await fetch(url, {
    method: req.method,
    headers,
    body
  });

  const text = await upstream.text();
  return new NextResponse(text || null, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" }
  });
}

type Params = { path: string[] };

export async function GET(req: NextRequest, { params }: { params: Params }) {
  return proxy(req, params.path);
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  return proxy(req, params.path);
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  return proxy(req, params.path);
}
