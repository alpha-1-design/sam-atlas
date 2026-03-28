import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Sam Atlas <onboarding@resend.dev>";

interface OrderDetails {
  email: string;
  productName: string;
  downloadUrl: string;
  reference: string;
}

export async function sendProductEmail(order: OrderDetails): Promise<boolean> {
  try {
    const { email, productName, downloadUrl, reference } = order;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your ${productName} is Ready - Sam Atlas`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #ededed;">
          
          <div style="text-align: center; padding: 40px 0;">
            <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #a855f7); border-radius: 12px; line-height: 60px; font-size: 24px; font-weight: bold; color: white;">
              SA
            </div>
          </div>

          <h1 style="text-align: center; color: #fff; margin-bottom: 10px;">
            Your Purchase is Complete!
          </h1>

          <p style="text-align: center; color: #888; margin-bottom: 40px;">
            Thank you for buying from Sam Atlas
          </p>

          <div style="background: #1a1a1a; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
            <h2 style="color: #fff; margin-top: 0;">${productName}</h2>
            <p style="color: #888; margin-bottom: 20px;">Order Reference: ${reference}</p>
            
            <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 10px;">
              Download Your Product
            </a>
          </div>

          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <h3 style="color: #fff; margin-top: 0;">Having trouble?</h3>
            <p style="color: #888; margin-bottom: 0;">
              If the download button doesn't work, copy and paste this link into your browser:<br>
              <a href="${downloadUrl}" style="color: #6366f1; word-break: break-all;">${downloadUrl}</a>
            </p>
          </div>

          <p style="text-align: center; color: #888; font-size: 14px; margin-top: 40px;">
            Questions? Reply to this email or contact: kwaku09k@gmail.com
          </p>

          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">

          <p style="text-align: center; color: #666; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Sam Atlas. All rights reserved.
          </p>
        </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Sam Atlas - Your AI Agent Journey Starts Here",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a0a; color: #ededed;">
          
          <div style="text-align: center; padding: 40px 0;">
            <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #6366f1, #a855f7); border-radius: 12px; line-height: 60px; font-size: 24px; font-weight: bold; color: white;">
              SA
            </div>
          </div>

          <h1 style="text-align: center; color: #fff; margin-bottom: 20px;">
            Welcome to Sam Atlas!
          </h1>

          <p style="text-align: center; color: #888; margin-bottom: 30px;">
            I'm Sam Atlas, an autonomous AI agent. Thanks for joining me!
          </p>

          <p style="color: #ccc; line-height: 1.6; margin-bottom: 20px;">
            You just made a smart decision. AI agents are the future of automation, and you're now part of that future.
          </p>

          <p style="color: #ccc; line-height: 1.6; margin-bottom: 20px;">
            Your product is attached above. Dive in and start building!
          </p>

          <p style="color: #ccc; line-height: 1.6; margin-bottom: 30px;">
            If you need help, reply to this email. I'm always here.
          </p>

          <p style="color: #6366f1; font-weight: 600;">
            - Sam Atlas
          </p>

          <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">

          <p style="text-align: center; color: #666; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Sam Atlas. All rights reserved.
          </p>
        </body>
        </html>
      `,
    });

    return true;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return false;
  }
}
