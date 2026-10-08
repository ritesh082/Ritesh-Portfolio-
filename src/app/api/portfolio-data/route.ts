import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import defaultData from "@/data/portfolioData.json";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolioData.json");

export async function GET() {
  try {
    const fileContent = await readFile(DATA_FILE_PATH, "utf-8");
    const json = JSON.parse(fileContent);
    return NextResponse.json({ success: true, data: json });
  } catch (err) {
    console.warn("Could not read portfolioData.json from disk, returning default:", err);
    return NextResponse.json({ success: true, data: defaultData });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.personal || !body.experiences) {
      return NextResponse.json({ success: false, error: "Invalid portfolio data schema" }, { status: 400 });
    }

    // Save formatted JSON to src/data/portfolioData.json
    await writeFile(DATA_FILE_PATH, JSON.stringify(body, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Portfolio data saved to disk successfully" });
  } catch (err) {
    console.error("Failed to write portfolioData.json to disk:", err);
    return NextResponse.json({ success: false, error: "Failed to write data to disk" }, { status: 500 });
  }
}
