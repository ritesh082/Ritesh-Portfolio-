import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SECRET_FILE_PATH = path.join(process.cwd(), "src", "data", "adminSecret.json");

function getStoredPassword(): string {
  if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim()) {
    return process.env.ADMIN_PASSWORD.trim();
  }

  try {
    if (fs.existsSync(SECRET_FILE_PATH)) {
      const content = fs.readFileSync(SECRET_FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.password === "string" && parsed.password.trim()) {
        return parsed.password.trim();
      }
    }
  } catch (err) {
    console.error("Error reading admin secret file:", err);
  }

  return "admin123";
}

function saveStoredPassword(newPass: string): boolean {
  try {
    const dir = path.dirname(SECRET_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SECRET_FILE_PATH, JSON.stringify({ password: newPass }, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving admin secret file:", err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, password, currentPassword, newPassword } = body;
    const currentStored = getStoredPassword();

    // 1. Action: LOGIN
    if (action === "login") {
      if (typeof password === "string" && password.trim() === currentStored) {
        return NextResponse.json({
          success: true,
          message: "Authenticated successfully",
          token: "valid_admin_session_" + Date.now(),
        });
      }
      return NextResponse.json(
        { success: false, error: "Invalid password. Access denied." },
        { status: 401 }
      );
    }

    // 2. Action: CHANGE PASSWORD (requires valid current password)
    if (action === "change_password") {
      if (!currentPassword || currentPassword.trim() !== currentStored) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect." },
          { status: 400 }
        );
      }

      if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      const saved = saveStoredPassword(newPassword.trim());
      if (saved) {
        return NextResponse.json({
          success: true,
          message: "Password changed successfully on server.",
        });
      } else {
        return NextResponse.json(
          { success: false, error: "Failed to persist new password to server." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("Admin auth API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
