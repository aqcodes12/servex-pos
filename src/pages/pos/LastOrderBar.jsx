import { Printer, XCircle, RotateCcw } from "lucide-react";
import MoneyValue from "../../components/MoneyValue";

const LastOrderBar = ({ order, role, onCancel, onReprint }) => {
  if (!order) return null;

  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-6 text-sm sm:text-base">
          <div className="font-semibold text-slate-700">
            Invoice:
            <span className="ml-2 text-teal-600 font-bold">
              {order.invoiceNo}
            </span>
          </div>

          <div className="font-semibold text-slate-700">
            Total:
            <span className="ml-2 font-bold text-slate-900">
              <MoneyValue amount={order.totalAmount} size={16} />
            </span>
          </div>

          {/* Status */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border
              ${
                order.status === "PAID"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
              }`}
          >
            {order.status}
          </span>
        </div>

        {/* Right actions */}
        <div className="flex gap-2">
          {/* Cashier */}
          {role === "CASHIER" && (
            <>
              <button
                onClick={onReprint}
                className="flex items-center gap-2 px-3 py-2
                  border border-slate-300 text-slate-700
                  rounded-lg hover:bg-slate-100 transition"
              >
                <Printer size={16} />
                Reprint
              </button>

              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-3 py-2
                  border border-yellow-300 text-yellow-700
                  rounded-lg hover:bg-yellow-50 transition"
              >
                <RotateCcw size={16} />
                Request Cancel
              </button>
            </>
          )}

          {/* Admin */}
          {role === "ADMIN" && (
            <>
              <button
                onClick={onReprint}
                className="flex items-center gap-2 px-3 py-2
                  border border-slate-300 text-slate-700
                  rounded-lg hover:bg-slate-100 transition"
              >
                <Printer size={16} />
                Reprint
              </button>

              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-3 py-2
                  border border-red-300 text-red-700
                  rounded-lg hover:bg-red-50 transition"
              >
                <XCircle size={16} />
                Cancel Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LastOrderBar;
