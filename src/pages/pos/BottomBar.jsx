import React from "react";
import MoneyValue from "../../components/MoneyValue";

const BottomBar = ({ total, canPay, clearBill }) => {
  return (
    <>
      <div className="p-3 border-t-2 border-gray-200">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className="flex-1 text-lg font-semibold">
            Total: <MoneyValue amount={total} size={14} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
            <button
              disabled={!canPay}
              onClick={() => alert("Cash payment")}
              className="bg-green-600 text-white py-3 rounded-xl disabled:opacity-40"
            >
              Cash
            </button>

            <button
              disabled={!canPay}
              onClick={() => alert("Card payment")}
              className="bg-blue-600 text-white py-3 rounded-xl disabled:opacity-40"
            >
              Card
            </button>

            <button
              disabled={!canPay}
              onClick={() => {
                alert("Sale completed");
                clearBill();
              }}
              className="bg-teal-500 text-white py-3 rounded-xl disabled:opacity-40"
            >
              Print / Complete
            </button>

            <button
              disabled={!canPay}
              onClick={clearBill}
              className="bg-red-500 text-white py-3 rounded-xl disabled:opacity-40"
            >
              Clear Bill
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomBar;
