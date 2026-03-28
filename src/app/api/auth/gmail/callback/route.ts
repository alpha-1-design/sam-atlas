import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { writeFileSync } from "fs";
import path from "path";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/gmail/callback"
);

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    };

    writeFileSync(
      path.join(process.cwd(), "gmail-token.json"),
      JSON.stringify(tokenData, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: "Gmail connected successfully!",
      refresh_token: tokens.refresh_token,
    });
  } catch (error) {
    console.error("Gmail OAuth error:", error);
    return NextResponse.json(
      { error: "Failed to connect Gmail" },
      { status: 500 }
    );
  }
}
