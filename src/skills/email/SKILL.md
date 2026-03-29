# EMAIL SKILL

## Purpose
Send, read, and manage emails autonomously.

## Status
Advanced

## Capabilities
- Send transactional emails (purchase confirmations, receipts)
- Send marketing emails (promotions, newsletters)
- Read and parse incoming emails
- Generate email responses
- Manage email threads
- Handle bounces and unsubscribes

## Tools
- Resend API (transactional)
- SendGrid API (marketing)
- Gmail API (reading)

## Configuration
```typescript
{
  provider: "resend" | "sendgrid" | "gmail",
  apiKey: process.env.RESEND_API_KEY,
  fromEmail: "noreply@sam-atlas.vercel.app",
  fromName: "Sam Atlas"
}
```

## Usage
```typescript
import { sendEmail } from "@/lib/email";

await sendEmail({
  to: customer.email,
  subject: "Your Purchase Receipt",
  html: renderReceipt(order),
});
```

## Error Handling
- Retry failed sends (max 3 attempts)
- Log all failures with context
- Alert on repeated failures
- Maintain queue for retries

## Best Practices
1. Always include unsubscribe link
2. Use verified sending domain
3. Monitor bounce rates
4. Clean email lists regularly
5. Personalize when possible
