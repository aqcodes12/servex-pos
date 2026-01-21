import React from "react";
import MoneyValue from "../../components/MoneyValue";

const ProductCard = ({ pro, onClick, className = "" }) => {
  const { name, sellingPrice } = pro;

  return (
    <button
      onClick={onClick}
      type="button"
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
      {/* Product Name (wraps, never hidden) */}
      <h3 className="text-lg font-semibold text-slate-900 leading-snug break-words">
        {name}
      </h3>

      {/* Price */}
      <div className="mt-2">
        <MoneyValue
          amount={sellingPrice}
          size={18}
          textClassName="text-slate-800 font-bold"
        />
      </div>
    </button>
  );
};

export default ProductCard;
