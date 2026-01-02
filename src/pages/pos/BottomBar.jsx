// import React from "react";
// import MoneyValue from "../../components/MoneyValue";

// const BottomBar = ({ total, canPay, clearBill }) => {
//   return (
//     <>
//       <div className="p-3 border-t-2 border-gray-200">
//         <div className="flex flex-col md:flex-row gap-2 items-center">
//           <div className="flex-1 text-lg font-semibold">
//             Total: <MoneyValue amount={total} size={14} />
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-1">
//             <button
//               disabled={!canPay}
//               onClick={() => alert("Cash payment")}
//               className="bg-green-600 text-white py-3 rounded-xl disabled:opacity-40"
//             >
//               Cash
//             </button>

//             <button
//               disabled={!canPay}
//               onClick={() => alert("Card payment")}
//               className="bg-blue-600 text-white py-3 rounded-xl disabled:opacity-40"
//             >
//               Card
//             </button>

//             <button
//               disabled={!canPay}
//               onClick={() => {
//                 alert("Sale completed");
//                 clearBill();
//               }}
//               className="bg-teal-500 text-white py-3 rounded-xl disabled:opacity-40"
//             >
//               Print / Complete
//             </button>

//             <button
//               disabled={!canPay}
//               onClick={clearBill}
//               className="bg-red-500 text-white py-3 rounded-xl disabled:opacity-40"
//             >
//               Clear Bill
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BottomBar;

import React from "react";
import MoneyValue from "../../components/MoneyValue";

const BottomBar = ({ total, canPay, clearBill }) => {
  return (
    <div className="p-4 border-t-2 border-slate-200 bg-white">
      <div className="flex items-center">
        {/* Total */}
        <div className="flex-shrink-0 text-xl font-bold text-slate-800 pr-6">
          Total: <MoneyValue amount={total} size={20} />
        </div>

        {/* Divider (visual spacing) */}
        <div className="h-10 w-px bg-slate-300 mr-6" />

        {/* Buttons */}
        <div className="flex flex-1 gap-3">
          <button
            disabled={!canPay}
            onClick={() => alert("Cash payment")}
            className="
              flex-1 h-14 rounded-xl
              bg-emerald-600 text-white text-lg font-semibold
              disabled:opacity-40
              active:scale-[0.98]
            "
          >
            Cash
          </button>

          <button
            disabled={!canPay}
            onClick={() => alert("Card payment")}
            className="
              flex-1 h-14 rounded-xl
              bg-indigo-600 text-white text-lg font-semibold
              disabled:opacity-40
              active:scale-[0.98]
            "
          >
            Card
          </button>

          <button
            disabled={!canPay}
            onClick={() => {
              alert("Sale completed");
              clearBill();
            }}
            className="
              flex-[1.5] h-14 rounded-xl
              bg-teal-500 text-white text-lg font-semibold
              disabled:opacity-40
              active:scale-[0.98]
            "
          >
            Print / Complete
          </button>

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
