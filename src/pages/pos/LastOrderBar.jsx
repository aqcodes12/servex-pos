import { Printer, XCircle, RotateCcw } from "lucide-react";
import MoneyValue from "../../components/MoneyValue";

const LastOrderBar = ({ order, role, onCancel, onReprint }) => {
  if (!order) return null;

  const isCancelled =
    order.status === "CANCELLED" || order.status === "CANCEL_REQUESTED";

  const statusStyles = {
    PAID: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    CANCEL_REQUESTED: "bg-orange-50 text-orange-700 border-orange-200",
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };

  return (
    <div className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* LEFT INFO */}
        <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
          {/* Invoice */}
          <div className="font-semibold text-slate-700">
            Invoice:
            <span className="ml-2 text-teal-600 font-bold">
              {order.invoiceNo}
            </span>
          </div>

          {/* Total */}
          <div className="font-semibold text-slate-700">
            Total:
            <span className="ml-2 font-bold text-slate-900">
              <MoneyValue amount={order.totalAmount} size={16} />
            </span>
          </div>

          {/* Status */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              statusStyles[order.status] ||
              "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex flex-wrap gap-2">
          {/* CASHIER ACTION */}
          {role === "CASHIER" && !isCancelled && (
            <>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-3 py-2
                border border-yellow-300 text-yellow-700
                rounded-lg hover:bg-yellow-50 transition"
              >
                <RotateCcw size={16} />
                Request Cancel
              </button>
              {/* Reprint (Both roles) */}
              <button
                onClick={onReprint}
                className="flex items-center gap-2 px-3 py-2
              border border-slate-300 text-slate-700
              rounded-lg hover:bg-slate-100 transition"
              >
                <Printer size={16} />
                Reprint
              </button>
            </>
          )}

          {/* ADMIN ACTION */}
          {role === "ADMIN" && !isCancelled && (
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
