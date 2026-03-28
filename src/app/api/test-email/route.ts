import { NextResponse } from "next/server";
import { sendProductEmail, sendWelcomeEmail } from "@/lib/email";

export async function GET() {
  const testEmail = "alphariansamuel@gmail.com";
  
  const result1 = await sendProductEmail({
    email: testEmail,
    productName: "AI Prompt Starter Pack",
    downloadUrl: "https://sam-atlas.vercel.app/downloads/ai-prompt-pack.pdf",
    reference: "TEST_001",
  });

  const result2 = await sendWelcomeEmail(testEmail, "AI Prompt Starter Pack");

  return NextResponse.json({
    message: "Test emails sent",
    productEmail: result1,
    welcomeEmail: result2,
    testEmail,
  });
}
