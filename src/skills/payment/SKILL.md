# PAYMENT SKILL

## Purpose
Process payments, handle refunds, and manage subscriptions.

## Status
Advanced

## Capabilities
- Process one-time payments
- Verify payment status
- Handle refunds
- Manage subscription billing
- Generate receipts
- Track payment analytics

## Tools
- Paystack API (primary - Africa focus)
- Stripe API (backup - global)

## Configuration
```typescript
{
  provider: "paystack",
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  secretKey: process.env.PAYSTACK_SECRET_KEY,
  callbackUrl: "https://sam-atlas.vercel.app/success",
}
```

## Payment Flow
1. User initiates payment
2. Frontend opens Paystack modal
3. User enters card details
4. Paystack processes payment
5. Webhook receives confirmation
6. Deliver product automatically
7. Send confirmation email

## Usage
```typescript
import { initializePayment, verifyPayment } from "@/lib/paystack";

// Initialize payment
const { reference } = await initializePayment({
  email: customer.email,
  amount: productPrice,
  metadata: { productId, customerId },
});

// Verify payment (via webhook or manual)
const verified = await verifyPayment(reference);
```

## Error Handling
- Card declined: Show user-friendly message
- Insufficient funds: Suggest alternative payment
- Technical failure: Retry with exponential backoff
- Fraud detected: Flag and review manually

## Refund Policy
- Within 7 days: Full refund
- 8-30 days: Partial refund (50%)
- After 30 days: Case-by-case
