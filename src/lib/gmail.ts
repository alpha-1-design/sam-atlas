import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/gmail/callback"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

export interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  threadId: string;
}

export async function getUnreadEmails(maxResults = 20): Promise<Email[]> {
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults,
    });

    const messages = response.data.messages || [];
    const emails: Email[] = [];

    for (const msg of messages) {
      const message = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "full",
      });

      const headers = message.data.payload?.headers || [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || "";

      const body = extractBody(message.data.payload);
      const snippet = message.data.snippet || "";

      emails.push({
        id: message.data.id!,
        from: getHeader("From"),
        to: getHeader("To"),
        subject: getHeader("Subject"),
        body: body || snippet,
        date: getHeader("Date"),
        threadId: message.data.threadId!,
      });
    }

    return emails;
  } catch (error) {
    console.error("Error fetching emails:", error);
    return [];
  }
}

function extractBody(payload: any): string {
  if (!payload) return "";

  if (payload.body?.data) {
    return Buffer.from(payload.body.data, "base64").toString("utf-8");
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
      if (part.parts) {
        const nested = extractBody(part);
        if (nested) return nested;
      }
    }
  }

  return "";
}

export async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  try {
    const encodedMessage = Buffer.from(
      `To: ${to}\r\n` +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/html; charset=utf-8\r\n\r\n` +
      body
    ).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function markAsRead(messageId: string): Promise<boolean> {
  try {
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        removeLabelIds: ["UNREAD"],
      },
    });
    return true;
  } catch (error) {
    console.error("Error marking as read:", error);
    return false;
  }
}

export async function createDraft(to: string, subject: string, body: string): Promise<boolean> {
  try {
    const encodedMessage = Buffer.from(
      `To: ${to}\r\n` +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/html; charset=utf-8\r\n\r\n` +
      body
    ).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");

    await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: {
          raw: encodedMessage,
        },
      },
    });

    return true;
  } catch (error) {
    console.error("Error creating draft:", error);
    return false;
  }
}
