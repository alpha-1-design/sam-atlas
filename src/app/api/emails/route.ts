import { NextResponse } from "next/server";
import { getUnreadEmails, markAsRead } from "@/lib/gmail";

export async function GET() {
  try {
    const emails = await getUnreadEmails(20);

    return NextResponse.json({
      success: true,
      count: emails.length,
      emails,
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { messageId } = await request.json();

    if (messageId) {
      await markAsRead(messageId);
      return NextResponse.json({ success: true, message: "Marked as read" });
    }

    return NextResponse.json(
      { error: "No messageId provided" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Operation failed" },
      { status: 500 }
    );
  }
}
