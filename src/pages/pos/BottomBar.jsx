import React from "react";
import MoneyValue from "../../components/MoneyValue";
import { CheckCircle2 } from "lucide-react";

const BottomBar = ({
  total,
  canPay,
  clearBill,
  selectedPaymentMode,
  onSelectPaymentMode,
  onComplete,
  loading,
}) => {
  const paymentBtnBase = `
    h-14 rounded-xl
    text-lg font-bold
    disabled:opacity-40
    active:scale-[0.98]
    transition-all duration-200
    relative overflow-hidden
    flex items-center justify-center
    min-w-0
  `;

  const selectedStyle = `
    ring-4 ring-offset-2 shadow-lg scale-[1.02]
    border-2 border-white
  `;

  const unselectedStyle = `
    opacity-80 hover:opacity-100
  `;

  const posUser = JSON.parse(localStorage.getItem("pos_user") || "{}");
  const country = (posUser?.restaurant?.country || "").toUpperCase();
  const isIndia = country === "INDIA";

  return (
    <div className="p-4 border-t-2 border-slate-200 bg-white">
      {/* ONE ROW GRID – NEVER WRAPS */}
      <div
        className="
          grid items-center gap-4
          grid-cols-[auto_1px_1fr]
        "
      >
        {/* TOTAL */}
        <div className="text-xl font-bold text-slate-800 whitespace-nowrap">
          Total: <MoneyValue amount={total} size={20} />
        </div>

        {/* DIVIDER */}
        <div className="h-10 w-px bg-slate-300" />

        {/* BUTTONS */}
        <div className="grid grid-cols-6 gap-3 min-w-0">
          {/* CASH */}
          <button
            disabled={!canPay}
            onClick={() => onSelectPaymentMode("CASH")}
            className={`
              ${paymentBtnBase}
              bg-emerald-600 text-white
              ${selectedPaymentMode === "CASH" ? selectedStyle : unselectedStyle}
            `}
          >
            {selectedPaymentMode === "CASH" && (
              <span className="absolute top-2 right-2 bg-white text-emerald-700 px-2 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
            Cash
          </button>

          {/* CARD */}
          <button
            disabled={!canPay}
            onClick={() => onSelectPaymentMode("CARD")}
            className={`
              ${paymentBtnBase}
              bg-indigo-600 text-white
              ${selectedPaymentMode === "CARD" ? selectedStyle : unselectedStyle}
            `}
          >
            {selectedPaymentMode === "CARD" && (
              <span className="absolute top-2 right-2 bg-white text-indigo-700 px-2 py-1 rounded-full text-xs font-bold shadow flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
            Card
          </button>

          {/* UPI or MADA */}
          <button
            disabled={!canPay}
            onClick={() => onSelectPaymentMode(isIndia ? "UPI" : "MADA")}
            className={`
    ${paymentBtnBase}
    ${isIndia ? "bg-purple-600" : "bg-orange-600"} text-white
    ${
      selectedPaymentMode === (isIndia ? "UPI" : "MADA")
        ? selectedStyle
        : unselectedStyle
    }
  `}
          >
            {selectedPaymentMode === (isIndia ? "UPI" : "MADA") && (
              <span
                className={`
        absolute top-2 right-2 bg-white
        ${isIndia ? "text-purple-700" : "text-orange-700"}
        px-2 py-1 rounded-full text-xs font-bold shadow
        flex items-center gap-1
      `}
              >
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
            {isIndia ? "UPI" : "MADA"}
          </button>

          {/* PRINT / COMPLETE */}
          <button
            disabled={!canPay || loading || !selectedPaymentMode}
            onClick={onComplete}
            className="
              col-span-2 h-14 rounded-xl
              bg-teal-500 text-white text-lg font-bold
              disabled:opacity-40
              active:scale-[0.98]
              transition-all duration-200
              shadow-md hover:shadow-lg
              min-w-0
            "
          >
            {loading ? "Processing..." : "Print / Complete"}
          </button>

          {/* CLEAR */}
          <button
            disabled={!canPay}
            onClick={clearBill}
            className="
              h-14 rounded-xl
              bg-red-500 text-white text-lg font-bold
              disabled:opacity-40
              active:scale-[0.98]
              transition-all duration-200
              shadow-md hover:shadow-lg
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
