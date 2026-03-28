const http = require("http");
const url = require("url");
const { google } = require("googleapis");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/api/auth/gmail/callback";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const scopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
].join(" ");

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  prompt: "consent",
});

console.log("\n" + "=".repeat(60));
console.log("📧 GOOGLE GMAIL AUTHORIZATION");
console.log("=".repeat(60));
console.log("\n1. Open this URL in your browser:\n");
console.log(authUrl);
console.log("\n2. Sign in and authorize");
console.log("3. The page will show an error - that's OK!");
console.log("4. Look at the URL in your browser");
console.log("5. Copy the 'code' parameter value\n");
console.log("=".repeat(60) + "\n");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const code = parsedUrl.query.code;
  
  if (code) {
    res.end("✅ Got code! Check the terminal for instructions.");
    
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) {
        console.log("\n❌ Error:", err.message);
        process.exit(1);
      }
      
      console.log("\n" + "=".repeat(60));
      console.log("✅ SUCCESS! COPY THIS TOKEN:");
      console.log("=".repeat(60));
      console.log("\nGOOGLE_REFRESH_TOKEN=" + tokens.refresh_token);
      console.log("\n" + "=".repeat(60));
      console.log("\n1. Copy the token above");
      console.log("2. Add to Vercel: GOOGLE_REFRESH_TOKEN");
      console.log("3. Redeploy!");
      console.log("=".repeat(60) + "\n");
      
      server.close();
      process.exit(0);
    });
  } else {
    res.end("Waiting for authorization...");
  }
});

server.listen(3000, () => {
  console.log("Server running. Complete authorization in browser.\n");
});
