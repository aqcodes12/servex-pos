import React from "react";
import MoneyValue from "../../components/MoneyValue";

const BottomBar = ({
  total,
  canPay,
  clearBill,
  selectedPaymentMode,
  onSelectPaymentMode,
  onComplete,
}) => {
  return (
    <div className="p-4 border-t-2 border-slate-200 bg-white">
      <div className="flex items-center">
        {/* Total */}
        <div className="flex-shrink-0 text-xl font-bold text-slate-800 pr-6">
          Total: <MoneyValue amount={total} size={20} />
        </div>

        {/* Divider */}
        <div className="h-10 w-px bg-slate-300 mr-6" />

        {/* Buttons */}
        <div className="flex flex-1 gap-3">
          {/* CASH */}
          <button
            disabled={!canPay}
            onClick={() => onSelectPaymentMode("CASH")}
            className={`
              flex-1 h-14 rounded-xl
              text-lg font-semibold
              disabled:opacity-40
              active:scale-[0.98]
              ${
                selectedPaymentMode === "CASH"
                  ? "bg-emerald-700 text-white ring-4 ring-emerald-200"
                  : "bg-emerald-600 text-white"
              }
            `}
          >
            Cash
          </button>

          {/* CARD */}
          <button
            disabled={!canPay}
            onClick={() => onSelectPaymentMode("CARD")}
            className={`
              flex-1 h-14 rounded-xl
              text-lg font-semibold
              disabled:opacity-40
              active:scale-[0.98]
              ${
                selectedPaymentMode === "CARD"
                  ? "bg-indigo-700 text-white ring-4 ring-indigo-200"
                  : "bg-indigo-600 text-white"
              }
            `}
          >
            Card
          </button>

          {/* UPI */}
          <button
            disabled={!canPay}
            onClick={() => onSelectPaymentMode("UPI")}
            className={`
              flex-1 h-14 rounded-xl
              text-lg font-semibold
              disabled:opacity-40
              active:scale-[0.98]
              ${
                selectedPaymentMode === "UPI"
                  ? "bg-purple-700 text-white ring-4 ring-purple-200"
                  : "bg-purple-600 text-white"
              }
            `}
          >
            UPI
          </button>

          {/* Print/Complete */}
          <button
            disabled={!canPay}
            onClick={onComplete} // ✅ hits create order api
            className="
              flex-[1.5] h-14 rounded-xl
              bg-teal-500 text-white text-lg font-semibold
              disabled:opacity-40
              active:scale-[0.98]
            "
          >
            Print / Complete
          </button>

          {/* Clear */}
          <button
            disabled={!canPay}
            onClick={clearBill}
            className="
              flex-1 h-14 rounded-xl
              bg-red-500 text-white text-lg font-semibold
              disabled:opacity-40
              active:scale-[0.98]
            "
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
