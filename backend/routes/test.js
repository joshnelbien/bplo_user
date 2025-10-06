// test.js
/**
 * Test SendGrid Email Sending
 * Make sure your .env contains:
 * SENDGRID_API_KEY=SG.xxx
 * SENDGRID_FROM=verified-sender@example.com
 * TEST_EMAIL=recipient@example.com
 */

require("dotenv").config({ path: "../.env" }); // <-- adjust path to your .en
const sgMail = require("@sendgrid/mail");

// -------------------------
// Debug environment variables
// -------------------------
console.log(
  "SENDGRID_API_KEY:",
  process.env.SENDGRID_API_KEY ? "Loaded ✅" : "Not found ❌"
);
console.log("SENDGRID_FROM:", process.env.SENDGRID_FROM || "Not set ❌");
console.log("TEST_EMAIL:", process.env.TEST_EMAIL || "Not set ❌");

// -------------------------
// Set API Key
// -------------------------
if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM) {
  console.error("❌ Missing SENDGRID_API_KEY or SENDGRID_FROM in .env");
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// -------------------------
// Prepare email
// -------------------------
const testEmail = process.env.TEST_EMAIL || process.env.SENDGRID_FROM;
const subject = "SendGrid Test Email";
const htmlContent = `
  <h2>SendGrid Test Email</h2>
  <p>If you see this, your SendGrid configuration is working!</p>
`;

// -------------------------
// Send email function
// -------------------------
async function sendTestEmail() {
  try {
    const [response] = await sgMail.send({
      to: testEmail,
      from: process.env.SENDGRID_FROM,
      subject,
      html: htmlContent,
    });

    console.log(`📧 Test email sent to ${testEmail}`);
    console.log(`Status Code: ${response.statusCode}`);
    console.log("Headers:", response.headers);
  } catch (err) {
    console.error(
      "❌ Test email failed:",
      err.response ? err.response.body : err
    );
  }
}

// -------------------------
// Run the test
// -------------------------
sendTestEmail();
