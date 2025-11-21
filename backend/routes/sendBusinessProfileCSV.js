const sgMail = require("@sendgrid/mail");
const BusinessProfile = require("../db/model/businessProfileDB");

async function sendBusinessProfileCSV() {
  try {
    const recipientEmail = "cict.sanpablocity.gov.ph";

    if (!process.env.SENDGRID_FROM) {
      console.log("❌ SendGrid sender email not set");
      return { success: false, message: "No sender email" };
    }

    // Today's date (YYYY-MM-DD)
    const today = new Date().toISOString().slice(0, 10);

    // Get all profiles
    const allProfiles = await BusinessProfile.findAll();

    // Filter updated today
    const todaysProfiles = allProfiles.filter((p) => {
      const updatedDate = new Date(p.updatedAt).toISOString().slice(0, 10);
      return updatedDate === today;
    });

    let keys = [];
    let csvRows = [];

    if (todaysProfiles.length === 0) {
      console.log("ℹ️ No transactions for today. Sending header only.");

      // If no data, get keys from model definition
      const sample = BusinessProfile.rawAttributes;
      keys = Object.keys(sample);

      csvRows.push(keys.join(",")); // header only
    } else {
      // Exclude BLOB fields
      const sample = todaysProfiles[0].toJSON();
      keys = Object.keys(sample).filter(
        (key) => !(sample[key] instanceof Buffer)
      );

      // Build CSV
      csvRows.push(keys.join(",")); // header

      todaysProfiles.forEach((profile) => {
        const obj = profile.toJSON();
        const values = keys.map((key) => {
          const val = obj[key] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(","));
      });
    }

    const csv = csvRows.join("\n");
    const filename = `businessProfiles_${today}.csv`;

    // Prepare email
    const msg = {
      to: recipientEmail,
      from: { email: process.env.SENDGRID_FROM, name: "Business Portal" },
      subject: `Business Profiles CSV Export (${today})`,
      text: "Attached is the latest Business Profiles CSV export for today.",
      attachments: [
        {
          content: Buffer.from(csv).toString("base64"),
          filename,
          type: "text/csv",
          disposition: "attachment",
        },
      ],
    };

    // Send email
    await sgMail.send(msg);

    console.log(`📤 CSV sent to ${recipientEmail}`);
    return { success: true, filename, csv };
  } catch (error) {
    console.error("❌ Error sending CSV email:", error.response?.body || error);
    return { success: false, error };
  }
}

module.exports = sendBusinessProfileCSV;
