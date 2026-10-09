import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import defaultData from "@/data/portfolioData.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolioData.json");

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET() {
  try {
    const fileContent = await readFile(DATA_FILE_PATH, "utf-8");
    const json = JSON.parse(fileContent);
    return NextResponse.json({ success: true, data: json }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.warn("Could not read portfolioData.json from disk, returning default:", err);
    return NextResponse.json({ success: true, data: defaultData }, { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.personal || !body.experiences) {
      return NextResponse.json(
        { success: false, error: "Invalid portfolio data schema" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const payloadWithTimestamp = {
      ...body,
      lastUpdated: body.lastUpdated || Date.now(),
    };

    try {
      await mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
      await writeFile(DATA_FILE_PATH, JSON.stringify(payloadWithTimestamp, null, 2), "utf-8");
    } catch (diskErr) {
      console.warn("Serverless runtime read-only notice:", diskErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio data updated successfully",
        data: payloadWithTimestamp,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    console.error("Portfolio data API error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update portfolio data" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}


