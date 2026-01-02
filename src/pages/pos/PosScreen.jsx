import React, { useState } from "react";
import { products } from "./products";
import MoneyValue from "../../components/MoneyValue";

const PosScreen = () => {
  const [activeCategory, setActiveCategory] = useState(products[0].category);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

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
  const updateCart = (updater) => {
    setCart((prev) => updater(prev));
  };

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

  const clearBill = () => setCart([]);

  /* ------------------ UI ------------------ */
  return (
    <div className="h-[85vh] bg-slate-100 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: PRODUCTS */}
        <div className="flex-1 p-3 flex flex-col overflow-hidden">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-teal-500"
          />

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto mb-3">
            {products.map((cat) => (
              <button
                key={cat.category}
                onClick={() => {
                  setActiveCategory(cat.category);
                  setSearch("");
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeCategory === cat.category
                    ? "bg-teal-500 text-white"
                    : "bg-white border"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto">
            {filteredItems.map((item) => (
              <button
                key={item.name}
                onClick={() => addToCart(item)}
                className="bg-white rounded-xl shadow-sm p-4 text-center active:scale-95"
              >
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-slate-500">
                  <MoneyValue amount={item.price} size={12} />
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: CART */}
        <div className="w-[350px] hidden md:flex flex-col border-l bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Current Bill</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 && (
              <p className="text-center text-slate-400">No items added</p>
            )}

            {cart.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    ₹{item.price} × {item.qty}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeQty(item.name, -1)}
                    className="px-2 bg-slate-200 rounded"
                  >
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => changeQty(item.name, 1)}
                    className="px-2 bg-slate-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="p-4 border-t">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="p-3 bg-white border-t">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className="flex-1 text-lg font-semibold">Total: ₹{total}</div>

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
    </div>
  );
};

export default PosScreen;
