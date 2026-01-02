// import React from "react";
// import MoneyValue from "../../components/MoneyValue";

// const ProductCard = ({ pro, onClick }) => {
//   return (
//     <>
//       <div
//         onClick={onClick}
//         className="flex justify-center items-center gap-5 bg-white p-5 rounded-2xl border border-gray-100 cursor-pointer"
//       >
//         <p className="text-2xl font-bold">{pro.name}</p>
//         <p className="">
//           <MoneyValue
//             amount={pro.price}
//             size={20}
//             textClassName="text-secondary text-xl font-semibold"
//           />
//         </p>
//       </div>
//     </>
//   );
// };

// export default ProductCard;

import React from "react";
import MoneyValue from "../../components/MoneyValue";

const ProductCard = ({ pro, onClick, className = "" }) => {
  const { name, price } = pro;

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-between
        w-full p-4 sm:p-5
        bg-white rounded-xl
        border border-gray-200
        hover:border-gray-300 hover:shadow-sm
        active:scale-[0.98] transition-all duration-200
        cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      type="button"
      aria-label={`View ${name} - ${price}`}
    >
      <div className="flex-1 text-left">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
      </div>

      <div className="ml-4 flex-shrink-0">
        <MoneyValue
          amount={price}
          size={16}
          textClassName="text-gray-800 font-bold"
        />
      </div>
    </button>
  );
};

export default ProductCard;
