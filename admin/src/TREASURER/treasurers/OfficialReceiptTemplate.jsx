export default function generateORHtml(data) {
  const {
    orNo,
    payor,
    fund,
    feeData,
    total,
    amountInWords,
    paymentMode,
    checkBank,
    checkNumber,
    checkDate,
  } = data;

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const printableFees = Object.entries(feeData).filter(
    ([_, f]) => f.quantity > 0
  );

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Official Receipt</title>

<style>
  /* ---- PAGE SIZE (4x8 inches) ---- */
  @page { 
    size: 4in 8in; 
    margin: 0; 
  }

  /* ---- GLOBAL STYLES ---- */
  body {
    margin: 0;
    padding: 0;
    font-family: "Times New Roman", serif;
    background: white;
    display: flex;
    justify-content: center;
  }

  /* ---- RECEIPT CONTAINER ---- */
  .receipt {
    width: 4in;
    height: 8in;
    padding: 10px;             /* PRINT PADDING */
    box-sizing: border-box;
    border: 1px solid #000;
  }

  /* ---- TABLE ---- */
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    margin-top: 4px;
  }

  th, td {
    border: 1px solid #000;
    padding: 3px;
  }

  th {
    text-align: center;
  }

  .right {
    text-align: right;
  }

  /* ---- IN WORDS BOX ---- */
  .words {
    border: 1px solid #000;
    padding: 4px;
    margin-top: 4px;
    font-size: 11px;
  }

  /* ---- HEADINGS ---- */
  .title {
    text-align: center;
    font-size: 16px;
    margin: 0;
  }

  .sub {
    text-align: center;
    font-size: 12px;
    margin: 0;
  }

  /* ---- LABELS ---- */
  .label {
    font-size: 12px;
    margin: 2px 0;
  }

</style>

</head>
<body>

<div class="receipt">

  <!-- HEADER -->
  <h3 class="title">OFFICIAL RECEIPT</h3>
  <p class="sub">Republic of the Philippines</p>

  <!-- INFO -->
  <p class="label">Date: ${today}</p>
  <p class="label">OR No: ${orNo}</p>
  <p class="label">Payor: ${payor}</p>
  <p class="label">Fund: ${fund}</p>

  <!-- TABLE -->
  <table>
    <thead>
      <tr>
        <th>NATURE OF COLLECTION</th>
        <th>AMOUNT</th>
      </tr>
    </thead>
    <tbody>
      ${printableFees
        .map(
          ([name, f]) => `
        <tr>
          <td>${name}</td>
          <td class="right">₱ ${(f.amount * f.quantity).toFixed(2)}</td>
        </tr>
      `
        )
        .join("")}

      <tr>
        <td><strong>TOTAL</strong></td>
        <td class="right"><strong>₱ ${total.toFixed(2)}</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- AMOUNT IN WORDS -->
  <div class="words">
    <strong>In Words:</strong> ${amountInWords}
  </div>

  <!-- PAYMENT TYPE -->
  <p class="label">Payment Mode: ${paymentMode.toUpperCase()}</p>

  ${
    paymentMode !== "cash"
      ? `
  <p class="label">Bank: ${checkBank}</p>
  <p class="label">Check No: ${checkNumber}</p>
  <p class="label">Check Date: ${checkDate}</p>
  `
      : ""
  }

</div>

</body>
</html>
`;
}
