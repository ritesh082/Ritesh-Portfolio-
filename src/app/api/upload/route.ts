import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const customFolder = (data.get("folder") as string) || "";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean the filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    
    // Determine destination path inside public/
    const destinationDir = customFolder 
      ? path.join(process.cwd(), "public", customFolder)
      : path.join(process.cwd(), "public");

    await mkdir(destinationDir, { recursive: true });

    const filePath = path.join(destinationDir, cleanName);
    await writeFile(filePath, buffer);

    const relativeUrl = customFolder ? `/${customFolder}/${cleanName}` : `/${cleanName}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      fileName: cleanName,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save file to public directory" },
      { status: 500 }
    );
  }
}
