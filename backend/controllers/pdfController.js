import puppeteer from "puppeteer";
import Invoice from "../models/Invoice.js";


export const generateInvoice = async (req, res) => {
  let browser, page;
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate("user", "name email");

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    


    const htmlContent = `
<html>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
        background: #fff;
        color: #000;
      }
      .container {
        max-width: 800px;
        margin: auto;
        padding: 40px;
        border-radius: 12px;
        background: #ffff;
      }
  

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
      }
      .header img {
        height: 40px;
      }
      .invoice-title {
        text-align: right;
        font-size: 14px;
      }
      .invoice-title h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
      }
      .invoice-title p {
        margin: 0;
        color: #888;
        font-size: 12px;
      }
      .customer-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #141414;
        padding: 18px;
        border-radius: 8px;
        margin-bottom: 20px;
        color: #fff;
      }
      .customer-left {
        display: flex;
        flex-direction: column;
      }
      .customer-left label {
        font-size: 12px;
        color: #aaa;
        margin-bottom: 4px;
      }
      .customer-left div {
        color: #a5f27f;
        font-size: 16px;
        font-weight: 600;
      }
      .email {
        background: #fff;
        color: #000;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 14px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
      }
        
     thead tr {
  background: linear-gradient(90deg, #2b2b4d, #4d4d2b);
  
  }
  
thead th {
  color: #fff;
  font-size: 14px;
  padding: 12px;
  text-align: left;
}
      td {
        padding: 12px;
        font-size: 14px;
      }
      tr:nth-child(even) {
        background: #f9f9f9;
      }
      .totals {
        border: 1px solid #ddd;
        padding: 20px;
        border-radius: 8px;
        width: 280px; /* ✅ Increased width */
        float: right;
        font-size: 14px;
        margin-bottom: 150px;
      }
      .totals .line {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px; /* ✅ Increased gap */
      }
      .totals .line h3 {
        margin: 0;
        font-weight: normal; /* ✅ No bold */
        color: gray; /* ✅ Gray for GST & Charges */
      }
      .totals .line h2 {
        margin: 0;
        font-size: 18px;
        font-weight: normal;
        color: #000; /* ✅ Black text for Total Amount label */
      }
      .amount-blue {
        color: #0000ff; /* ✅ Blue for numeric amount */
        font-weight: normal;
      }
      .footer {
        clear: both;
        margin-top: 30px;
        text-align: center;
        padding: 18px;
        background: #141414;
        color: #fff;
        font-size: 12px;
        border-radius: 20px;
      }
      .bottom-date {
        text-align: left;
        font-size: 12px;
        margin-top: 250px;
        margin-bottom:12px;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="logo">
  <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none">
    <path d="M39 19.5L29.5 39H25H9.80385L5.53038 30.5L0 19.5L9.5 0H14H29.5L33.641 8.5L39 19.5Z" fill="black"/>
    <path d="M25 30.5L30.5 19.5L25 8.5L34 19.5L25 30.5Z" fill="white"/>
    <path d="M12.5 10.5L14 8.5L8.5 19.5L14 30.5L5.5 19.5L12.5 10.5Z" fill="white"/>
  </svg>
  
</div>

        <div class="invoice-title">
          <h2>INVOICE GENERATOR</h2>
          <p>Sample Output should be this</p>
        </div>
      </div>
      <hr>

      <!-- Customer Info -->
      <div class="customer-info">
        <div class="customer-left">
          <label>Name</label>
          <div>${invoice.user.name}</div>
        </div>
        <div class="customer-right">
          <div>Date: ${new Date(invoice.createdAt).toLocaleDateString()}</div>
          <div class="email">${invoice.user.email}</div>
        </div>
      </div>

      <!-- Items Table -->
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>₹${item.price}</td>
              <td>₹${item.total}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <!-- Totals -->
      <div class="totals">
        <div class="line">
          <h3>Total Charges:</h3>
          <h3>₹${invoice.subTotal.toFixed(2)}</h3>
        </div>
        <div class="line">
          <h3>GST (18%):</h3>
          <h3>₹${invoice.gst.toFixed(2)}</h3>
        </div>
        <div class="line">
          <h2>Total Amount:</h2>
          <h2 style="color: blue;" class="amount-blue">₹${invoice.finalAmount.toFixed(2)}</h2>
        </div>
      </div>
      <div class="bottom-date">Date: ${new Date(invoice.createdAt).toLocaleDateString()}</div>

      <!-- Footer -->
      <div class="footer">
        We are pleased to provide any further information you may require and look forward to assisting with your next order. Rest assured, it will receive our prompt and dedicated attention.
      </div>
    </div>
  </body>
</html>
`;
browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
page = await browser.newPage();

// 3️⃣ Generate PDF from HTML
await page.setContent(htmlContent, { waitUntil: "networkidle0" });
const pdfBuffer = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
});

// 4️⃣ Close browser
await browser.close();

// 5️⃣ Send PDF as response
res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `attachment; filename=invoice-${invoice._id}.pdf`
);
return res.send(pdfBuffer);

} catch (err) {
console.error("PDF generation failed:", err);
if (browser) await browser.close();
if (!res.headersSent) res.status(500).json({ error: "PDF generation failed" });
}
};