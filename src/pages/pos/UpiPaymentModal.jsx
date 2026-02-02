// import React from "react";
// import MoneyValue from "../../components/MoneyValue";
// import QrCode from "../../assets/qrcode.png";

// const UpiPaymentModal = ({ open, total, onPaid, onClose }) => {
//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
//       <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center">
//         <h2 className="text-xl font-bold mb-2">Scan & Pay (UPI)</h2>

//         {/* QR IMAGE */}
//         <img
//           src={QrCode}
//           alt="UPI QR"
//           className="mx-auto w-56 h-56 object-contain my-4"
//         />

//         {/* TOTAL */}
//         <div className="text-lg font-semibold mb-4">
//           Amount: <MoneyValue amount={total} size={20} />
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-2 border rounded-lg"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onPaid}
//             className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg font-bold"
//           >
//             Payment Done
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpiPaymentModal;

import React, { useEffect, useState } from "react";
import MoneyValue from "../../components/MoneyValue";
import axios from "axios";
import QRCode from "qrcode";

const UpiPaymentModal = ({ open, total, onPaid, onClose }) => {
  const [qrImage, setQrImage] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!open) return;

    const loadUpi = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          "https://dineics.onrender.com/api/restaurant/get-upi",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const data = res.data?.data;

        if (!data?.enabled) {
          setError("UPI payment is not enabled");
          return;
        }

        setUpiId(data.upiId);

        // Take QR string from API and append amount
        let upiUrl = data.qrString;

        // Add amount dynamically
        upiUrl += `&am=${total.toFixed(2)}`;

        // Generate QR from UPI string
        const qr = await QRCode.toDataURL(upiUrl);
        setQrImage(qr);
      } catch (err) {
        setError("Failed to load UPI details");
      } finally {
        setLoading(false);
      }
    };

    loadUpi();
  }, [open, total, token]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center">
        <h2 className="text-xl font-bold mb-2">Scan & Pay (UPI)</h2>

        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

        {loading ? (
          <p className="py-10 text-gray-500">Loading QR...</p>
        ) : (
          <>
            {upiId && (
              <p className="text-sm text-gray-500 mb-2">UPI ID: {upiId}</p>
            )}

            {qrImage && (
              <img
                src={qrImage}
                alt="UPI QR"
                className="mx-auto w-56 h-56 object-contain my-4"
              />
            )}
          </>
        )}

        {/* TOTAL */}
        <div className="text-lg font-semibold mb-4">
          Amount: <MoneyValue amount={total} size={20} />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            disabled={loading || !!error}
            onClick={onPaid}
            className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg font-bold disabled:opacity-50"
          >
            Payment Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentModal;
