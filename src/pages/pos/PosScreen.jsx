import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import MoneyValue from "../../components/MoneyValue";
import ProductCard from "./ProductCard";
import CartItem from "./CartItem";
import BottomBar from "./BottomBar";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../assets/slogo.png";
import { Clock, LogOut } from "lucide-react";
import LastOrderBar from "./LastOrderBar";
import RecentOrdersDrawer from "./RecentOrdersDrawer";

const PosScreen = () => {
  const navigate = useNavigate();

  const posUser = JSON.parse(localStorage.getItem("pos_user"));
  const role = posUser?.role;
  const [showRecentOrders, setShowRecentOrders] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  const token = localStorage.getItem("token");
  const [activeCategory, setActiveCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ✅ API States
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [apiError, setApiError] = useState("");

  // ✅ Payment + Tax (for create order)
  const [selectedPaymentMode, setSelectedPaymentMode] = useState(""); // default UPI

  const [taxType] = useState("GST");
  const [taxRate] = useState(5);

  const total = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.qty,
    0,
  );
  const canPay = cart.length > 0;

  // ------------------ API CALLS ------------------

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await axios.get("/product/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiCategories = res.data?.data || [];

      // ✅ Inject "All" at UI level
      setCategories(["All", ...apiCategories]);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async ({ searchText = "", category = "" }) => {
    try {
      setLoadingProducts(true);
      setApiError("");

      const res = await axios.get("/product/get-products", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          ...(searchText ? { search: searchText } : {}),
          ...(category && category !== "All" ? { category } : {}),
          isActive: true,
        },
      });

      const apiProducts = res.data?.data || [];

      // ✅ Map backend -> UI product model
      const mapped = apiProducts.map((p) => ({
        id: p._id,
        name: p.name,
        category: p.category,
        sellingPrice: p.sellingPrice,
        costPrice: p.costPrice,
        isActive: p.isActive,
      }));

      setProducts(mapped);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchLastOrder = async () => {
    try {
      const res = await axios.get("/order/recent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orders = res.data?.data || [];
      if (!orders.length) return;

      const lastFive = orders.slice(0, 5);
      setRecentOrders(lastFive);

      const latest = orders[0]; // 👈 MOST RECENT

      setLastOrder({
        orderId: latest._id,
        invoiceNo: latest.invoiceNumber,
        totalAmount: latest.amount,
        status: latest.status,
        paymentMode: latest.paymentMode,
        createdAt: latest.createdAt,
      });
    } catch (err) {
      console.error("Failed to fetch last order");
    }
  };

  const generateClientOrderId = () => crypto.randomUUID();

  // ✅ create order
  const createOrder = async () => {
    if (creatingOrder) return;
    try {
      setCreatingOrder(true);
      setApiError("");

      if (!token) {
        setApiError("Token missing. Please login again.");
        return;
      }

      if (cart.length === 0) {
        setApiError("Cart is empty.");
        return;
      }

      if (!selectedPaymentMode) {
        setApiError("Please select a payment mode.");
        return;
      }

      const clientOrderId = generateClientOrderId();

      const payload = {
        clientOrderId,
        items: cart.map((i) => ({
          productId: i.id,
          quantity: i.qty,
        })),
        paymentMode: selectedPaymentMode,
        taxType, // "GST"
        taxRate, // 5
      };

      const res = await axios.post("/order/create-order", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ order created successfully
      const order = res.data?.data;
      console.log("ORDER CREATED:", order);

      // ✅ clear cart after payment
      setCart([]);

      alert("Order created successfully!");
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create order",
      );
    } finally {
      setCreatingOrder(false);
    }
  };

  // ------------------ LIFE CYCLE ------------------

  useEffect(() => {
    if (!token) {
      setApiError("Token missing. Please login again.");
      return;
    }

    fetchCategories();
    fetchLastOrder();
  }, []);

  // ✅ fetch products whenever category or search changes
  useEffect(() => {
    if (!token) return;
    fetchProducts({ searchText: search, category: activeCategory });
  }, [activeCategory, search]);

  // ------------------ CART ACTIONS ------------------

  const updateCart = (updater) => setCart((prev) => updater(prev));

  const addToCart = (product) => {
    updateCart((cart) => {
      const item = cart.find((i) => i.id === product.id);
      return item
        ? cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...cart, { ...product, qty: 1 }];
    });
  };

  const changeQty = (name, delta) => {
    updateCart((cart) =>
      cart
        .map((i) => (i.name === name ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const removeItem = (name) => {
    updateCart((cart) => cart.filter((i) => i.name !== name));
  };

  const clearBill = () => setCart([]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // ✅ filter only for UI render (api already filters, but still good)
  const filteredItems = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  return (
    <>
      <div className={`h-[90vh] ${role === "CASHIER" ? "p-5" : "p-0"}`}>
        {role === "CASHIER" && (
          <header className="">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16 sm:h-20">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-lg sm:text-xl">
                      <img src={BrandLogo} alt="" />
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                      POS
                    </h1>
                    <p className="hidden sm:block text-xs text-slate-500">
                      Logged in as{" "}
                      <span className="font-medium text-slate-700">
                        {posUser?.name}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5
                    text-sm font-medium text-red-600 hover:text-white
                    bg-red-50 hover:bg-red-500
                    rounded-lg transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
        )}

        <div className="h-full flex flex-col border-2 border-slate-200 rounded-3xl bg-white overflow-hidden">
          {/* ✅ API ERROR */}
          {apiError && (
            <div className="mx-4 mt-4 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl">
              {apiError}
            </div>
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* LEFT */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
                {/* Search */}
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);

                    if (value.trim().length > 0) {
                      setActiveCategory("All");
                    }
                  }}
                  className="w-full mb-4 px-5 py-3 text-lg rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {loadingCategories ? (
                    <div className="text-slate-500">Loading categories...</div>
                  ) : (
                    categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setSearch("");
                        }}
                        className={`px-6 py-3 text-lg font-bold rounded-full whitespace-nowrap active:scale-95 ${
                          activeCategory === cat
                            ? "bg-teal-500 text-white shadow"
                            : "bg-white border border-slate-300 text-slate-700"
                        }`}
                      >
                        {cat}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Products */}
              <div className="flex-1 overflow-y-auto p-4">
                {loadingProducts ? (
                  <div className="text-center text-slate-500 text-lg py-10">
                    Loading products...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        pro={item}
                        onClick={() => addToCart(item)}
                      />
                    ))}
                  </div>
                )}

                {!loadingProducts && filteredItems.length === 0 && (
                  <div className="text-center text-slate-400 text-lg py-10">
                    No products found
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT CART */}
            <div className="w-[360px] hidden md:flex flex-col border-l-2 border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-xl font-semibold">Current Bill</h2>
              </div>

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
              <div className="p-4 border-t-2 border-slate-200 space-y-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <MoneyValue amount={total} size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <BottomBar
            total={total}
            canPay={canPay}
            clearBill={clearBill}
            selectedPaymentMode={selectedPaymentMode}
            onSelectPaymentMode={setSelectedPaymentMode}
            onComplete={createOrder}
            loading={creatingOrder}
          />
          {lastOrder && (
            <LastOrderBar
              order={lastOrder}
              role={role}
              // onReprint={() => (lastOrder)}
              // onCancel={() => handleCancelOrder(lastOrder)}
            />
          )}
        </div>
      </div>

      {/* Logout confirm */}
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

      <button
        onClick={() => setShowRecentOrders(true)}
        className="fixed bottom-6 right-6 z-40
    w-12 h-12 rounded-full
    bg-white border border-slate-300
    shadow-lg hover:bg-slate-100
    flex items-center justify-center"
      >
        <Clock size={20} />
      </button>

      <RecentOrdersDrawer
        open={showRecentOrders}
        onClose={() => setShowRecentOrders(false)}
        orders={recentOrders}
        role={role}
        onReprint={(order) => {
          console.log("Reprint order:", order);
        }}
        onCancel={(order) => {
          console.log("Cancel order:", order);
        }}
      />
    </>
  );
};

export default PosScreen;
