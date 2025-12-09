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

  // -----------------------------
  // Positions & layout (px)
  // -----------------------------
  const layout = {
    width: 288, // 4in
    height: 576, // 8in
    padding: 10,
    titleTop: 10,
    subTop: 30,
    dateTop: 120,
    orNoTop: 100,
    payorTop: 150,
    payorWidth: 260,
    fundTop: 150,
    tableTop: 185,
    tableLeft: 10,
    tableWidth: 268,
    rowHeight: 22,
    wordsTopOffset: 10,
    paymentTopOffset: 60,
    leftMargin: 10,
  };

  const wordsTop =
    layout.tableTop +
    printableFees.length * layout.rowHeight +
    layout.wordsTopOffset;
  const paymentTop =
    layout.tableTop +
    printableFees.length * layout.rowHeight +
    layout.paymentTopOffset;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @page { size: 4in 8in; margin: 0; }
  body { margin:0; padding:0; font-family:"Times New Roman", serif; display:flex; justify-content:center; background:#fff; }
  .receipt {
    width: ${layout.width}px;
    height: ${layout.height}px;
    position: relative;
    border: 1px solid #000;
    background: #fff;
    padding: ${layout.padding}px;
    box-sizing: border-box;
  }
  /* Header */
  .title { position:absolute; top:${
    layout.titleTop
  }px; left:0; width:100%; text-align:center; font-size:16px; }
  .sub { position:absolute; top:${
    layout.subTop
  }px; left:0; width:100%; text-align:center; font-size:12px; }
  /* Labels */
  .label { position:absolute; font-size:12px; }
    .label { position:absolute; font-size:12px; }

  .orno { top:${layout.orNoTop}px; right:20px; }
    .date { top:${layout.dateTop}px; right:20px; }
  .payor { top:${layout.payorTop}px; left:${layout.leftMargin}px; width:${
    layout.payorWidth
  }px; }
  .fund { top:${layout.fundTop}px; right: 20px; }
  /* Table */
  table { position:absolute; top:${layout.tableTop}px; left:${
    layout.tableLeft
  }px; width:${layout.tableWidth}px; border-collapse:collapse; font-size:11px; }
  th, td { border:1px solid #000; padding:2px 4px; }
  th { text-align:center; }
  .right { text-align:right; }
  /* Amount in Words */
  .words { position:absolute; top:${wordsTop}px; left:${
    layout.leftMargin
  }px; width:${
    layout.tableWidth
  }px; border:1px solid #000; padding:4px; font-size:11px; }
  /* Payment Info */
  .payment-info { position:absolute; top:${paymentTop}px; left:${
    layout.leftMargin
  }px; font-size:12px; }
</style>
</head>
<body>
<div class="receipt">

  <p class="label orno">${orNo}</p>
  <p class="label date">${today}</p>
  <p class="label payor">Payor: ${payor}</p>
  <p class="label fund">Fund: ${fund}</p>

  <table>
    <thead>
      <tr><th>NATURE OF COLLECTION</th><th>AMOUNT</th></tr>
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
      <tr><td><strong>TOTAL</strong></td><td class="right"><strong>₱ ${total.toFixed(
        2
      )}</strong></td></tr>
    </tbody>
  </table>

  <div class="words"><strong>In Words:</strong> ${amountInWords}</div>

  <div class="payment-info">
    <p>Payment Mode: ${paymentMode.toUpperCase()}</p>
    ${
      paymentMode !== "cash"
        ? `
      <p>Bank: ${checkBank}</p>
      <p>Check No: ${checkNumber}</p>
      <p>Check Date: ${checkDate}</p>
    `
        : ""
    }
  </div>

</div>
</body>
</html>
`;
}
