import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoadingId, setPdfLoadingId] = useState(null); // For tracking which invoice is downloading
  const [form, setForm] = useState({ name: "", price: "", quantity: "" });
  const [items, setItems] = useState([]);
  const [currentInvoiceId, setCurrentInvoiceId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = () => {
    if (!form.name || !form.price || !form.quantity) return;

    const newItem = {
      name: form.name,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity),
      total: parseFloat(form.price) * parseInt(form.quantity),
    };

    setItems([...items, newItem]);
    setForm({ name: "", price: "", quantity: "" });
  };

  const handleSaveInvoice = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/invoices",
        { items },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInvoices([res.data, ...invoices]);
      setCurrentInvoiceId(res.data._id);
      setItems([]);
    } catch (err) {
      console.error("Error saving invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id) => {
    if (!id) return;
    try {
      setPdfLoadingId(id); // Show spinner for this invoice
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/invoices/generate-pdf/${id}`,
        { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setPdfLoadingId(null); // Hide spinner
    }
  };

  const handleDeleteInvoice = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvoices(invoices.filter((inv) => inv._id !== id));
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  };

  const calculateSubtotal = (items) =>
    items.reduce((acc, item) => acc + item.total, 0);

  const calculateGST = (subtotal) => subtotal * 0.18;

  return (
    <div className="w-full min-h-screen bg-[#141414] flex flex-col text-white">
      {/* Navbar */}
      <header className="w-full sticky top-0 z-0 bg-[#1e1e1e] border-b border-[#2c2c2c7c] shadow-md">
        <div className="w-full max-w-[1280px] mx-auto flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/images/img_group_39660.svg"
              alt="Logo"
              className="w-10 h-10"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold lowercase">levitation</span>
              <span className="text-xs lowercase">Infotech</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-[#282c20] to-[#ccf575] text-[#141414] text-sm font-medium rounded-md px-4 py-2 transform transition-all duration-300 hover:-translate-x-5"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Add Products</h1>
          <p className="text-gray-400 mb-6">
            Basic invoice page created for levitation <br /> assignment purpose.
          </p>

          {/* Add Product Form */}
          <div className="p-6 rounded-lg mb-10">
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Enter the product Name"
                value={form.name}
                onChange={handleChange}
                className="p-3 rounded-md bg-[#2c2c2c] text-white"
              />
              <input
                type="number"
                name="price"
                placeholder="Enter the price"
                value={form.price}
                onChange={handleChange}
                className="p-3 rounded-md bg-[#2c2c2c] text-white"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Enter the qty"
                value={form.quantity}
                onChange={handleChange}
                className="p-3 rounded-md bg-[#2c2c2c] text-white"
              />
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2c2c2c] text-[#95C11F] text-lg transition"
              >
                Add Product <span className="text-1xl">+</span>
              </button>
            </div>
          </div>

          {/* Invoice Preview */}
          {items.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Invoice Preview</h2>
              <table className="w-full text-left text-sm bg-[#1e1e1e] border border-[#2c2c2c] rounded-lg shadow">
                <thead className="bg-[#2c2c2c] text-gray-200">
                  <tr>
                    <th className="p-3 text-lg">Product Name</th>
                    <th className="p-3 text-lg">Price</th>
                    <th className="p-3 text-lg">Quantity</th>
                    <th className="p-3 text-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-b border-[#2c2c2c]">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">₹{item.price}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#2c2c2c] text-gray-200 font-semibold">
                  <tr>
                    <td colSpan="3" className="p-3 text-right">Sub Total:</td>
                    <td className="p-3">₹{calculateSubtotal(items).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="p-3 text-right">GST (18%):</td>
                    <td className="p-3">₹{calculateGST(calculateSubtotal(items)).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="p-3 text-right">Final Amount:</td>
                    <td className="p-3">₹{(calculateSubtotal(items)*1.18).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleSaveInvoice}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#141414] to-[#303030] text-[#ccf575] font-semibold px-8 py-3 rounded-md"
                >
                  {loading ? "Saving..." : "Save Invoice"}
                </button>

                <button
                  onClick={() => handleDownloadPDF(currentInvoiceId)}
                  className="bg-green-600 text-white font-semibold px-8 py-3 rounded-md flex items-center justify-center"
                  disabled={!currentInvoiceId || pdfLoadingId === currentInvoiceId}
                >
                  {pdfLoadingId === currentInvoiceId ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Generate PDF"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Saved Invoices */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Saved Invoices</h2>
            {invoices.length === 0 ? (
              <p className="text-gray-400">No invoices found</p>
            ) : (
              invoices.map((inv) => {
                const subtotal = calculateSubtotal(inv.items);
                const gst = calculateGST(subtotal);
                const finalAmount = subtotal + gst;
                return (
                  <div
                    key={inv._id}
                    className="border border-[#2c2c2c] rounded-lg p-4 mb-6"
                  >
                    <table className="w-full text-left text-sm mb-4">
                      <thead className="bg-white text-black">
                        <tr>
                          <th className="p-2 text-left">Product Name ↑</th>
                          <th className="p-2 text-left">Price</th>
                          <th className="p-2 text-left">Quantity ↓</th>
                          <th className="p-2 text-left">Total Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inv.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-[#2c2c2c]">
                            <td className="p-2">{item.name}</td>
                            <td className="p-2">₹{item.price}</td>
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2">₹{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className=" text-gray-200 font-semibold">
                        <tr>
                          <td colSpan="3" className="p-2 text-right">Sub Total:</td>
                          <td className="p-2">₹{subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="p-2 text-right">GST (18%):</td>
                          <td className="p-2">₹{gst.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan="3" className="p-2 text-right">Final Amount:</td>
                          <td className="p-2">₹{finalAmount.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>

                    <div className="flex justify-between">
                      <button
                        onClick={() => handleDeleteInvoice(inv._id)}
                        className="bg-red-600 text-white text-sm font-semibold rounded-md px-4 py-1"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(inv._id)}
                        className=" text-green-600 text-sm font-semibold rounded-md px-6 py-2 flex items-center justify-center"
                        disabled={pdfLoadingId === inv._id}
                      >
                        {pdfLoadingId === inv._id ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          "Generate PDF Invoice"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
      <div>
        
      </div>
    </div>
  );
};

export default Home;
