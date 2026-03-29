#!/usr/bin/env node

const readline = require("readline");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "YOUR_CLIENT_SECRET";
const REDIRECT_URI = "http://localhost:3000/api/auth/gmail/callback";

if (CLIENT_ID === "YOUR_CLIENT_ID" || CLIENT_SECRET === "YOUR_CLIENT_SECRET") {
  console.log("\nError: Please set environment variables first:");
  console.log("export GOOGLE_CLIENT_ID=your_client_id");
  console.log("export GOOGLE_CLIENT_SECRET=your_client_secret");
  console.log("\nThen run this script again.\n");
  process.exit(1);
}

const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${encodeURIComponent(CLIENT_ID)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent("https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify")}&response_type=code&access_type=offline&prompt=consent`;

console.log("\n" + "=".repeat(60));
console.log("GOOGLE GMAIL AUTHORIZATION");
console.log("=".repeat(60));
console.log("\n1. Open this URL in your browser:\n");
console.log(authUrl);
console.log("\n2. Sign in with your Google account");
console.log("3. Click 'Continue' to authorize");
console.log("4. The page will try to redirect to localhost - that's OK!");
console.log("5. Look at the URL in your browser");
console.log("6. Copy the 'code' parameter value (everything after 'code=' and before '&scope')");
console.log("\nFor example: https://localhost/?code=THIS_IS_THE_CODE_YOU_COPY");
console.log("\n".repeat(2));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Paste the authorization code here: ", async (code) => {
  rl.close();
  
  if (!code || code.trim() === "") {
    console.log("\nError: No code provided. Please run the script again and paste the code.");
    process.exit(1);
  }
  
  console.log("\nExchanging code for tokens...\n");
  
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code.trim(),
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
      }),
    });
    
    const data = await response.json();
    
    if (data.refresh_token) {
      console.log("\n" + "=".repeat(60));
      console.log("SUCCESS! COPY THIS TOKEN:");
      console.log("=".repeat(60));
      console.log("\nGOOGLE_REFRESH_TOKEN=" + data.refresh_token);
      console.log("\n" + "=".repeat(60));
      console.log("\nNext steps:");
      console.log("1. Copy the token above");
      console.log("2. Go to Vercel > Project > Settings > Environment Variables");
      console.log("3. Add: GOOGLE_REFRESH_TOKEN = " + data.refresh_token);
      console.log("4. Redeploy");
      console.log("=".repeat(60) + "\n");
    } else {
      console.log("\nError: " + (data.error || "No refresh token received"));
      console.log("\nFull response:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.log("\nRequest failed: " + err.message);
  }
});
