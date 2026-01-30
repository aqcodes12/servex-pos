import React, { useEffect, useRef, useState } from "react";
import { X, Printer } from "lucide-react";
import MoneyValue from "./MoneyValue";
import axios from "axios";

const Invoice = ({ open, onClose, orderId }) => {
  const printRef = useRef(null);

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Get auth + business from localStorage
  const token = localStorage.getItem("token");
  const posUser = JSON.parse(localStorage.getItem("pos_user"));
  const business = posUser?.restaurant || {};

  // 🔹 Fetch order (AXIOS)
  useEffect(() => {
    if (!open || !orderId || !token) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`/order/get-order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.data?.success) {
          throw new Error("Failed to load invoice");
        }

        setSale(res.data.data);
      } catch (err) {
        setError(
          err?.response?.data?.message || err.message || "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [open, orderId, token]);

  const handlePrint = () => {
    const printContent = document.getElementById("invoice-print-content");
    if (!printContent) return;

    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
    <style>
      @page {
        size: 80mm 200mm;
        margin: 0;
      }

      @media print {
        html, body {
          width: 80mm;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: monospace;
          display: flex;
          justify-content: center; 
        }

        #invoice-print-content {
          width: 72mm;
        }
      }
    </style>

    <div id="invoice-print-content">
      ${printContent.innerHTML}
    </div>
  `;

    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      {/* MODAL */}
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full h-[95vh] flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">Invoice Preview</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Loading invoice…
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="flex-1 flex items-center justify-center text-red-500">
            {error}
          </div>
        )}

        {/* CONTENT + FOOTER */}
        {sale && (
          <>
            {/* 🔥 SCROLLABLE CONTENT (THIS IS THE KEY FIX) */}
            <div className="flex-1 overflow-y-auto">
              <div
                ref={printRef}
                id="invoice-print-content"
                className="w-[272px] mx-auto text-black font-mono"
              >
                {/* HEADER */}
                {/* HEADER */}
                <div className="text-center mb-2">
                  <p className="text-[17px] font-bold">{business.name}</p>

                  {business.address && (
                    <p className="text-[11px] leading-tight">
                      {business.address}
                    </p>
                  )}

                  {business.phone && (
                    <p className="text-[11px]">Phone: {business.phone}</p>
                  )}

                  {business.trn && (
                    <p className="text-[11px]">VAT No: {business.trn}</p>
                  )}
                </div>

                <div className="border-t border-dashed my-2" />

                {/* META */}
                <div className="text-[11px]">
                  <div className="flex justify-between">
                    <span>Invoice</span>
                    <span>{sale.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>
                      {new Date(sale.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed my-2" />

                {/* ITEMS */}
                <div className="text-[12px]">
                  <div className="flex justify-between font-bold mb-1">
                    <span>Item</span>
                    <span>Amt</span>
                  </div>

                  {sale.items.map((item) => (
                    <div key={item._id} className="mb-1">
                      <div className="flex justify-between">
                        <span className="truncate max-w-[180px]">
                          {item.name}
                        </span>
                        <MoneyValue amount={item.total} />
                      </div>

                      <div className="flex justify-between text-[11px] opacity-70">
                        <span>
                          {item.quantity} x{" "}
                          <MoneyValue amount={item.sellingPrice} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed my-2" />

                {/* TOTALS */}
                <div className="text-[12px] space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <MoneyValue amount={sale.subtotal} />
                  </div>

                  {sale.tax?.enabled && (
                    <div className="flex justify-between">
                      <span>
                        {sale.tax.taxType} ({sale.tax.rate}%)
                      </span>
                      <MoneyValue amount={sale.tax.amount} />
                    </div>
                  )}

                  <div className="border-t border-dashed my-1" />

                  <div className="flex justify-between text-[14px] font-bold">
                    <span>TOTAL</span>
                    <MoneyValue amount={sale.grandTotal} />
                  </div>

                  <div className="flex justify-between text-[12px]">
                    <span>Payment</span>
                    <span>{sale.paymentMode}</span>
                  </div>
                </div>

                <div className="border-t border-dashed my-2" />

                {/* FOOTER */}
                <div className="text-center text-[11px]">
                  <p>Thank you for your business!</p>
                  <p>Please visit again</p>
                </div>
              </div>
            </div>

            {/* 🔒 FIXED FOOTER (NO EXTRA SPACE BELOW) */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90"
              >
                <Printer className="w-5 h-5" />
                Print Invoice
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Invoice;
