// import React, { useState } from "react";
// import { products } from "./products";
// import MoneyValue from "../../components/MoneyValue";
// import ProductCard from "./ProductCard";
// import { Trash2 } from "lucide-react";
// import CartItem from "./CartItem";
// import BottomBar from "./BottomBar";

// const PosScreen = () => {
//   const [activeCategory, setActiveCategory] = useState(products[0].category);
//   const [search, setSearch] = useState("");
//   const [cart, setCart] = useState([]);

//   /* ------------------ DATA ------------------ */
//   const currentCategory = products.find(
//     (cat) => cat.category === activeCategory
//   );

//   const filteredItems = currentCategory.items.filter((item) =>
//     item.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

//   const canPay = cart.length > 0;

//   /* ------------------ CART ACTIONS ------------------ */
//   const updateCart = (updater) => {
//     setCart((prev) => updater(prev));
//   };

//   const addToCart = (product) => {
//     updateCart((cart) => {
//       const item = cart.find((i) => i.name === product.name);
//       return item
//         ? cart.map((i) =>
//             i.name === product.name ? { ...i, qty: i.qty + 1 } : i
//           )
//         : [...cart, { ...product, qty: 1 }];
//     });
//   };

//   const changeQty = (name, delta) => {
//     updateCart((cart) =>
//       cart
//         .map((i) => (i.name === name ? { ...i, qty: i.qty + delta } : i))
//         .filter((i) => i.qty > 0)
//     );
//   };

//   const removeItem = (name) => {
//     updateCart((cart) => cart.filter((i) => i.name !== name));
//   };

//   const clearBill = () => setCart([]);

//   /* ------------------ UI ------------------ */
//   return (
//     <div className="">
//       <div className="h-[85vh] flex flex-col border-2 border-gray-200 p-5 rounded-3xl">
//         <div className="flex flex-1 overflow-hidden">
//           {/* LEFT: PRODUCTS */}
//           <div className="flex-1 p-3 flex flex-col overflow-hidden">
//             {/* Search */}

//             <input
//               type="text"
//               placeholder="Search products..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="
//     w-full mb-4
//     px-5 py-3
//     text-lg
//     rounded-xl
//     border border-slate-300
//     bg-white
//     focus:outline-none
//     focus:ring-2 focus:ring-teal-500
//   "
//             />

//             {/* Categories */}
//             <div className="flex gap-2 overflow-x-auto mb-3">
//               {products.map((cat) => (
//                 <button
//                   key={cat.category}
//                   onClick={() => {
//                     setActiveCategory(cat.category);
//                     setSearch("");
//                   }}
//                   className={`
//     px-6 py-3
//     text-lg font-semibold
//     rounded-full
//     whitespace-nowrap
//     transition-all
//     active:scale-95
//     ${
//       activeCategory === cat.category
//         ? "bg-teal-500 text-white shadow"
//         : "bg-white border border-slate-300 text-slate-700"
//     }
//   `}
//                 >
//                   {cat.category}
//                 </button>
//               ))}
//             </div>

//             {/* Products */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3  p-5">
//               {filteredItems.map((item) => (
//                 <ProductCard
//                   key={item.name}
//                   pro={item}
//                   onClick={() => addToCart(item)}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* RIGHT: CART */}
//           <div className="w-[350px] hidden md:flex flex-col border-l-2 border-gray-200 ">
//             <div className="p-4 border-b-2 border-gray-200">
//               <h2 className="text-lg font-semibold">Current Bill</h2>
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 space-y-3">
//               {cart.length === 0 && (
//                 <p className="text-center text-slate-400">No items added</p>
//               )}

//               {cart.map((item) => (
//                 <CartItem
//                   key={item.name}
//                   item={item}
//                   changeQty={changeQty}
//                   removeItem={removeItem}
//                 />
//               ))}
//             </div>

//             {/* Total */}
//             <div className="p-4 border-t-2 border-gray-200 pt-2">
//               <div className="flex justify-between font-semibold text-lg">
//                 <span>Total</span>
//                 <span>
//                   <MoneyValue amount={total} size={14} />
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* BOTTOM BAR */}

//         <BottomBar total={total} canPay={canPay} clearBill={clearBill} />
//       </div>
//     </div>
//   );
// };

// export default PosScreen;

import React, { useState } from "react";
import { products } from "./products";
import MoneyValue from "../../components/MoneyValue";
import ProductCard from "./ProductCard";
import CartItem from "./CartItem";
import BottomBar from "./BottomBar";
import { useNavigate } from "react-router-dom";

const PosScreen = () => {
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("pos_user")).role;
  console.log(role);
  const [activeCategory, setActiveCategory] = useState(products[0].category);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  /* ------------------ DATA ------------------ */
  const currentCategory = products.find(
    (cat) => cat.category === activeCategory
  );

  const filteredItems = currentCategory.items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const canPay = cart.length > 0;

  /* ------------------ CART ACTIONS ------------------ */
  const updateCart = (updater) => setCart((prev) => updater(prev));

  const addToCart = (product) => {
    updateCart((cart) => {
      const item = cart.find((i) => i.name === product.name);
      return item
        ? cart.map((i) =>
            i.name === product.name ? { ...i, qty: i.qty + 1 } : i
          )
        : [...cart, { ...product, qty: 1 }];
    });
  };

  const changeQty = (name, delta) => {
    updateCart((cart) =>
      cart
        .map((i) => (i.name === name ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (name) => {
    updateCart((cart) => cart.filter((i) => i.name !== name));
  };

  const clearBill = () => setCart([]);

  /* ------------------ UI ------------------ */

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };
  return (
    <>
      <div className={`${role === "cashier" ? "h-[90vh]" : "h-[85vh]"} p-4`}>
        {role === "cashier" && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
            {/* Left: Title & User */}
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                POS
              </h1>
              <p className="text-sm text-slate-500">
                Logged in as{" "}
                <span className="font-medium text-slate-700">
                  {JSON.parse(localStorage.getItem("pos_user"))?.name}
                </span>
              </p>
            </div>

            {/* Right: Logout */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium
               text-white bg-red-500 hover:bg-red-600
               rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Logout
            </button>
          </div>
        )}

        <div className="h-full flex flex-col border-2 border-slate-200 rounded-3xl bg-white overflow-hidden">
          {/* MAIN */}
          <div className="flex flex-1 overflow-hidden">
            {/* LEFT: PRODUCTS */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search + Categories (Sticky) */}
              <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                  w-full mb-4
                  px-5 py-3
                  text-lg
                  rounded-xl
                  border border-slate-300
                  focus:outline-none
                  focus:ring-2 focus:ring-teal-500
                "
                />

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {products.map((cat) => (
                    <button
                      key={cat.category}
                      onClick={() => {
                        setActiveCategory(cat.category);
                        setSearch("");
                      }}
                      className={`
                      px-6 py-3
                      text-lg font-semibold
                      rounded-full
                      whitespace-nowrap
                      active:scale-95
                      ${
                        activeCategory === cat.category
                          ? "bg-teal-500 text-white shadow"
                          : "bg-white border border-slate-300 text-slate-700"
                      }
                    `}
                    >
                      {cat.category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Grid (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <ProductCard
                      key={item.name}
                      pro={item}
                      onClick={() => addToCart(item)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: CART */}
            <div className="w-[360px] hidden md:flex flex-col border-l-2 border-slate-200">
              {/* Header */}
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-xl font-semibold">Current Bill</h2>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 && (
                  <p className="text-center text-slate-400 text-lg">
                    No items added
                  </p>
                )}

                {cart.map((item) => (
                  <CartItem
                    key={item.name}
                    item={item}
                    changeQty={changeQty}
                    removeItem={removeItem}
                  />
                ))}
              </div>

              {/* Total */}
              <div className="p-4 border-t-2 border-slate-200">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <MoneyValue amount={total} size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <BottomBar total={total} canPay={canPay} clearBill={clearBill} />
        </div>
      </div>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PosScreen;
