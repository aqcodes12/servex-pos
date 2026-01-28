// import React from "react";
// import MoneyValue from "../../components/MoneyValue";

// const ProductCard = ({ pro, onClick, className = "" }) => {
//   const { name, sellingPrice } = pro;

//   return (
//     <button
//       onClick={onClick}
//       type="button"
//       className={`
//         w-full p-4 sm:p-5
//         bg-white rounded-xl
//         border border-slate-200
//         hover:border-slate-300 hover:shadow-sm
//         active:scale-[0.98] transition-all duration-150
//         text-left
//         focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
//         ${className}
//       `}
//     >
//       {/* Product Name (wraps, never hidden) */}
//       <h3 className="text-lg font-semibold text-slate-900 leading-snug break-words">
//         {name}
//       </h3>

//       {/* Price */}
//       <div className="mt-2">
//         <MoneyValue
//           amount={sellingPrice}
//           size={18}
//           textClassName="text-slate-800 font-bold"
//         />
//       </div>
//     </button>
//   );
// };

// export default ProductCard;

// import React from "react";
// import MoneyValue from "../../components/MoneyValue";

// const ProductCard = ({ pro, onClick, className = "" }) => {
//   const { name, sellingPrice } = pro;

//   return (
//     <div className="relative group">
//       {/* Tooltip */}
//       <div
//         className="
//           pointer-events-none
//           absolute -top-2 left-1/2 z-50
//           max-w-[90%]
//           -translate-x-1/2 -translate-y-full
//           rounded-md bg-slate-900 px-3 py-1.5
//           text-xs text-white
//           opacity-0 scale-95
//           transition-all duration-150
//           group-hover:opacity-100 group-hover:scale-100
//           whitespace-normal text-center
//           shadow-lg
//         "
//       >
//         {name}
//       </div>

//       {/* Card */}
//       <button
//         type="button"
//         onClick={onClick}
//         className={`
//           w-full p-4 sm:p-5
//           bg-white rounded-xl
//           border border-slate-200
//           hover:border-slate-300 hover:shadow-sm
//           active:scale-[0.98] transition-all duration-150
//           text-left
//           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
//           ${className}
//         `}
//       >
//         {/* Product Name (single line + ellipsis) */}
//         <h3 className="text-lg font-semibold text-slate-900 truncate">
//           {name}
//         </h3>

//         {/* Price */}
//         <div className="mt-2">
//           <MoneyValue
//             amount={sellingPrice}
//             size={18}
//             textClassName="text-slate-800 font-bold"
//           />
//         </div>
//       </button>
//     </div>
//   );
// };

// export default ProductCard;

import React, { useRef, useState, useEffect } from "react";
import MoneyValue from "../../components/MoneyValue";
import PortalTooltip from "./PortalTooltip";

const ProductCard = ({ pro, onClick, className = "" }) => {
  const { name, sellingPrice } = pro;

  const textRef = useRef(null);
  const cardRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current;
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [name]);

  const handleMouseEnter = () => {
    if (!isTruncated || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setPos({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
    setShowTooltip(true);
  };

  return (
    <>
      {/* Tooltip via Portal */}
      {showTooltip && (
        <PortalTooltip>
          <div
            className="
              fixed z-[9999]
              -translate-x-1/2 -translate-y-full
              rounded-md bg-slate-900 px-3 py-1.5
              text-xs text-white shadow-lg
              max-w-[300px] text-center
            "
            style={{ top: pos.top, left: pos.left }}
          >
            {name}
          </div>
        </PortalTooltip>
      )}

      {/* Card */}
      <button
        ref={cardRef}
        type="button"
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          w-full p-4 sm:p-5
          bg-white rounded-xl
          border border-slate-200
          hover:border-slate-300 hover:shadow-sm
          active:scale-[0.98] transition-all duration-150
          text-left
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
          ${className}
        `}
      >
        <h3
          ref={textRef}
          className="text-lg font-semibold text-slate-900 truncate"
        >
          {name}
        </h3>

        <div className="mt-2">
          <MoneyValue
            amount={sellingPrice}
            size={18}
            textClassName="text-slate-800 font-bold"
          />
        </div>
      </button>
    </>
  );
};

export default ProductCard;
