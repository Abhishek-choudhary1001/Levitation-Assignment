import puppeteer from "puppeteer";
import Invoice from "../models/Invoice.js";

export const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate("user", "name email");

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    const htmlContent = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Roboto', sans-serif; margin:0; padding:0; background:#f5f5f5; }
            .container { max-width:800px; margin:auto; background:#fff; padding:20px; border-radius:8px; }
            .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; }
            .header img { height:50px; }
            .header .invoice-title { text-align:right; }
            .header .invoice-title h2 { margin:0; }
            .customer-info { display:flex; justify-content:space-between; background:#1b1b2f; color:#c4f27f; padding:15px; border-radius:8px; margin-bottom:20px; }
            .customer-info .email { background:#fff; color:#000; padding:5px 10px; border-radius:20px; }
            table { width:100%; border-collapse:collapse; margin-bottom:20px; }
            th, td { padding:12px; text-align:left; }
            th { background: linear-gradient(to right, #2b2b4d, #4d4d2b); color:#fff; }
            tr:nth-child(even) { background:#f5f5f5; }
            .totals { border:1px solid #ddd; padding:15px; border-radius:8px; width:200px; float:right; }
            .totals h3, .totals h2 { margin:5px 0; }
            .footer { clear:both; margin-top:50px; text-align:center; padding:15px; background:#1b1b2f; color:#fff; border-radius:20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                <img src="https://yourlogo.com/logo.png" />
              </div>
              <div class="invoice-title">
                <h2>INVOICE</h2>
                <p>Date: ${new Date(invoice.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div class="customer-info">
              <div>Name: ${invoice.user.name}</div>
              <div class="email">${invoice.user.email}</div>
            </div>

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

            <div class="totals">
              <h3>Total Charges: ₹${invoice.subTotal.toFixed(2)}</h3>
              <h3>GST (18%): ₹${invoice.gst.toFixed(2)}</h3>
              <h2>Total Amount: ₹${invoice.finalAmount.toFixed(2)}</h2>
            </div>

            <div class="footer">
              We are pleased to provide any further information you may require and look forward to assisting with your next order.
            </div>
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${invoice._id}.pdf`,
    });
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
