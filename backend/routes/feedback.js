const express = require("express");
const emailjs = require("@emailjs/nodejs");

const router = express.Router();

/* ---------------------------------------------------
 ✅ EmailJS send function
--------------------------------------------------- */
async function sendEmail(templateParams) {
  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_FEEDBACK_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY,
      }
    );

    console.log("📧 Feedback email sent via EmailJS");
    console.log("Status:", response.status);
  } catch (err) {
    console.error("❌ EmailJS error:", err);
    throw err;
  }
}

/* ---------------------------------------------------
 📩 Feedback Route
--------------------------------------------------- */
router.post("/send-feedback", async (req, res) => {
  try {
    const {
      clientName,
      emailAddress,
      contactNo,
      transactionDate,
      transactionTime,
      employeeName,
      serviceAvailed,
      ratings,
      comments,
    } = req.body;

    /* 🧱 Build formatted HTML for ratings */
    let ratingsHtml = "";
    for (const section in ratings) {
      ratingsHtml += `
        <h4 style="color:#144C22;">${section}</h4>
        <table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;width:100%;font-size:13px;">
          <thead style="background-color:#f3f3f3;">
            <tr>
              <th align="left">Criteria</th>
              <th align="center">Rating</th>
            </tr>
          </thead>
          <tbody>
            ${ratings[section]
              .map(
                (item) => `
              <tr>
                <td>${item.criteria}</td>
                <td align="center">${item.rating}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table><br/>
      `;
    }

    const templateParams = {
      to_email: "feedback@sanpablocity.gov.ph",
      client_name: clientName || "N/A",
      email: emailAddress || "N/A",
      contact_no: contactNo || "N/A",
      transaction_date: transactionDate || "N/A",
      transaction_time: transactionTime || "N/A",
      employee_name: employeeName || "N/A",
      service_availed: serviceAvailed || "N/A",
      ratings_html: ratingsHtml,
      comments: comments || "No additional comments.",
    };

    /* ✅ Send email */
    await sendEmail(templateParams);

    res.status(200).json({ message: "Feedback sent successfully" });
  } catch (err) {
    console.error("❌ Feedback processing error:", err);
    res.status(500).json({ error: "Failed to send feedback" });
  }
});

module.exports = router;
