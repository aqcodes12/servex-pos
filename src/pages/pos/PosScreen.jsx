import React, { useState } from "react";
import { products } from "./products";
import MoneyValue from "../../components/MoneyValue";
import ProductCard from "./ProductCard";
import { Trash2 } from "lucide-react";
import CartItem from "./CartItem";
import BottomBar from "./BottomBar";

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

  const removeItem = (name) => {
    updateCart((cart) => cart.filter((i) => i.name !== name));
  };

  const clearBill = () => setCart([]);

  /* ------------------ UI ------------------ */
  return (
    <div className="">
      <div className="h-[85vh] flex flex-col border-2 border-gray-200 p-5 rounded-3xl">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3  p-5">
              {filteredItems.map((item) => (
                <ProductCard
                  key={item.name}
                  pro={item}
                  onClick={() => addToCart(item)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: CART */}
          <div className="w-[350px] hidden md:flex flex-col border-l-2 border-gray-200 ">
            <div className="p-4 border-b-2 border-gray-200">
              <h2 className="text-lg font-semibold">Current Bill</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 && (
                <p className="text-center text-slate-400">No items added</p>
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
            <div className="p-4 border-t-2 border-gray-200">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>
                  <MoneyValue amount={total} size={14} />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}

        <BottomBar total={total} canPay={canPay} clearBill={clearBill} />
      </div>
    </div>
  );
};

export default PosScreen;
