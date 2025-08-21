import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true }, // price * quantity
});

const invoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [productSchema],
    subTotal: { type: Number, required: true },
    gst: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
