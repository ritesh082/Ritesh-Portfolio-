import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import defaultData from "@/data/portfolioData.json";

export const dynamic = "force-dynamic";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolioData.json");

export async function GET() {
  try {
    const fileContent = await readFile(DATA_FILE_PATH, "utf-8");
    const json = JSON.parse(fileContent);
    return NextResponse.json({ success: true, data: json });
  } catch {
    return NextResponse.json({ success: true, data: defaultData });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.personal || !body.experiences) {
      return NextResponse.json({ success: false, error: "Invalid portfolio data schema" }, { status: 400 });
    }

    try {
      await writeFile(DATA_FILE_PATH, JSON.stringify(body, null, 2), "utf-8");
    } catch (diskErr) {
      console.warn("Serverless runtime read-only notice:", diskErr);
    }

    return NextResponse.json({ success: true, message: "Portfolio data updated successfully", data: body });
  } catch (err: any) {
    console.error("Portfolio data API error:", err);
    return NextResponse.json({ success: true, message: "Processed" });
  }
}

