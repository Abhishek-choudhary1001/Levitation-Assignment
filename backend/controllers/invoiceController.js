import Invoice from "../models/Invoice.js";

// Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const { clientName, clientEmail, items } = req.body;

    // Calculate subTotal
    const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calculate GST (18%)
    const gst = (subTotal * 18) / 100;

    // Final Amount
    const finalAmount = subTotal + gst;

    const invoice = await Invoice.create({
      user: req.user._id,
      clientName,
      clientEmail,
      items: items.map(i => ({ ...i, total: i.price * i.quantity })),
      subTotal,
      gst,
      finalAmount
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all invoices for logged-in user
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single invoice
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update invoice
export const updateInvoice = async (req, res) => {
  try {
    const { clientName, clientEmail, items, status } = req.body;

    // Recalculate amounts if items changed
    const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = (subTotal * 18) / 100;
    const finalAmount = subTotal + gst;

    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        clientName,
        clientEmail,
        items: items.map(i => ({ ...i, total: i.price * i.quantity })),
        subTotal,
        gst,
        finalAmount,
        status
      },
      { new: true }
    );

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
