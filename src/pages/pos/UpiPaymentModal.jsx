import React from "react";
import MoneyValue from "../../components/MoneyValue";
import QrCode from "../../assets/qrcode.png";

const UpiPaymentModal = ({ open, total, onPaid, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center">
        <h2 className="text-xl font-bold mb-2">Scan & Pay (UPI)</h2>

        {/* QR IMAGE */}
        <img
          src={QrCode}
          alt="UPI QR"
          className="mx-auto w-56 h-56 object-contain my-4"
        />

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
            onClick={onPaid}
            className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg font-bold"
          >
            Payment Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpiPaymentModal;
