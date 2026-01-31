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
import { showSuccessToast } from "../../utils/toastConfig";
import Invoice from "../../components/Invoice";
import UpiPaymentModal from "./UpiPaymentModal";

const PosScreen = () => {
  const navigate = useNavigate();

  const posUser = JSON.parse(localStorage.getItem("pos_user"));
  const role = posUser?.role;

  const token = localStorage.getItem("token");

  const [showRecentOrders, setShowRecentOrders] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [showLastOrder, setShowLastOrder] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [categories, setCategories] = useState([{ id: "ALL", name: "All" }]);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [apiError, setApiError] = useState("");

  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceOrderId, setInvoiceOrderId] = useState(null);

  const total = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.qty,
    0,
  );

  const canPay = cart.length > 0;

  /* ---------------- API CALLS (UNCHANGED) ---------------- */

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await axios.get("/category/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const cats = (res.data?.data || [])
        .filter((c) => c.isActive)
        .map((c) => ({
          id: c._id,
          name: c.name,
        }));

      setCategories([{ id: "ALL", name: "All" }, ...cats]);
    } catch {
      setApiError("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchAllProducts = async () => {
    const res = await axios.get("/product/get-products", {
      headers: { Authorization: `Bearer ${token}` },
      params: { isActive: true },
    });

    setProducts(
      (res.data?.data || []).map((p) => ({
        id: p._id,
        name: p.name,
        sellingPrice: p.sellingPrice,
        costPrice: p.costPrice,
        isActive: p.isActive,
      })),
    );
  };

  const fetchProductsByCategory = async (categoryId) => {
    const res = await axios.get(
      `/product/get-products-by-category/${categoryId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setProducts(
      (res.data?.data || []).map((p) => ({
        id: p._id,
        name: p.name,
        sellingPrice: p.sellingPrice,
        costPrice: p.costPrice,
        isActive: p.isActive,
      })),
    );
  };

  const fetchLastOrder = async () => {
    const res = await axios.get("/order/recent", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const orders = res.data?.data || [];
    if (!orders.length) return;

    setRecentOrders(orders.slice(0, 5));

    const latest = orders[0];
    setLastOrder({
      orderId: latest._id,
      invoiceNo: latest.invoiceNumber,
      totalAmount: latest.amount,
      status: latest.status,
      cancelRequested: latest.cancelRequested, // ✅ ADD THIS
      paymentMode: latest.paymentMode,
      createdAt: latest.createdAt,
    });
  };

  const generateClientOrderId = () => crypto.randomUUID();

  const createOrder = async () => {
    if (creatingOrder) return;

    try {
      setCreatingOrder(true);
      setApiError("");

      if (!cart.length) return setApiError("Cart is empty.");
      if (!selectedPaymentMode)
        return setApiError("Please select a payment mode.");

      const payload = {
        clientOrderId: generateClientOrderId(),
        items: cart.map((i) => ({ productId: i.id, quantity: i.qty })),
        paymentMode: selectedPaymentMode,
      };

      const res = await axios.post("/order/create-order", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const createdOrderId = res.data?.data?._id;

      // ✅ reset POS
      setSelectedPaymentMode("");
      setCart([]);
      await fetchLastOrder();
      setShowLastOrder(true);

      // ✅ OPEN INVOICE
      if (createdOrderId) {
        setInvoiceOrderId(createdOrderId);
        setShowInvoice(true);
      }
      showSuccessToast("Order created successfully");
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to create order");
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleCancelOrder = async (order) => {
    const id = order.orderId || order._id; // 🔥 FIX

    if (!id) {
      console.error("Order ID missing", order);
      return;
    }

    const endpoint =
      role === "ADMIN" ? `/order/${id}/cancel` : `/order/${id}/request-cancel`;

    try {
      const res = await axios.post(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 && res.data.success) {
        const message = res.data.msg;
        showSuccessToast(message || "Order cancellation successful");

        setLastOrder((prev) =>
          prev
            ? {
                ...prev,
                status: role === "ADMIN" ? "CANCELLED" : "CANCEL_REQUESTED",
              }
            : prev,
        );
      }

      await fetchLastOrder();
    } catch (err) {
      console.error(err);
      setApiError("Failed to cancel order");
    }
  };

  /* ---------------- LIFE CYCLE ---------------- */

  useEffect(() => {
    if (!token) return;
    fetchCategories();
    fetchLastOrder();
  }, []);

  useEffect(() => {
    if (!token) return;

    setLoadingProducts(true);

    if (activeCategory === "ALL") {
      fetchAllProducts().finally(() => setLoadingProducts(false));
    } else {
      fetchProductsByCategory(activeCategory).finally(() =>
        setLoadingProducts(false),
      );
    }
  }, [activeCategory]);

  /* ---------------- CART ---------------- */

  const addToCart = (product) => {
    setShowLastOrder(false);
    setCart((c) => {
      const found = c.find((i) => i.id === product.id);
      return found
        ? c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { ...product, qty: 1 }];
    });
  };

  const changeQty = (name, delta) =>
    setCart((c) =>
      c
        .map((i) => (i.name === name ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const removeItem = (name) => setCart((c) => c.filter((i) => i.name !== name));

  const clearBill = () => setCart([]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const filteredItems = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, search],
  );

  /* ---------------- UI ---------------- */

  return (
    <>
      <div className={`h-[90vh] ${role === "CASHIER" ? "p-5" : "p-0"}`}>
        {/* HEADER */}
        {role === "CASHIER" && (
          <header className="mb-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <img src={BrandLogo} alt="logo" className="h-10" />
                <div>
                  <h1 className="text-lg font-bold text-primary">POS</h1>
                  <p className="text-xs text-text/60">
                    Logged in as {posUser?.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </header>
        )}

        <div className="h-full flex flex-col border border-slate-200 rounded-3xl bg-white overflow-hidden">
          {apiError && (
            <div className="m-4 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-red-600">
              {apiError}
            </div>
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* PRODUCTS */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-white">
                <input
                  value={search}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);
                    if (value) setActiveCategory("ALL");
                  }}
                  placeholder="Search products…"
                  className="w-full px-5 py-3 rounded-xl border border-slate-300
                  text-lg focus:ring-2 focus:ring-secondary"
                />

                <div className="flex gap-3 overflow-x-auto mt-4 pb-2">
                  {loadingCategories ? (
                    <span className="text-text/60 whitespace-nowrap">
                      Loading categories…
                    </span>
                  ) : (
                    categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setSearch("");
                        }}
                        className={`px-6 py-3 rounded-full font-semibold text-lg whitespace-nowrap
      ${
        activeCategory === cat.id
          ? "bg-secondary text-white"
          : "bg-background border border-slate-300"
      }`}
                      >
                        {cat.name}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loadingProducts ? (
                  <p className="text-center text-text/60 py-10">
                    Loading products…
                  </p>
                ) : filteredItems.length === 0 ? (
                  <p className="text-center text-text/40 py-10">
                    No products found
                  </p>
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
              </div>
            </div>

            {/* CART */}
            <div className="hidden md:flex md:w-[300px] lg:w-[350px] flex-col border-l border-slate-200">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-primary">
                  Current Bill
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 && (
                  <p className="text-center text-text/40">No items added</p>
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

              {/* <div className="p-4 border-t">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <MoneyValue amount={total} size={18} />
                </div>
              </div> */}
              <div className="p-4 border-t space-y-1">
                {/* Order Summary */}
                <div className="text-left text-sm text-text/80">
                  <p>Order Summary</p>
                  <span>
                    {totalItems} item{totalItems !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <MoneyValue amount={total} size={18} />
                </div>
              </div>
            </div>
          </div>

          <BottomBar
            total={total}
            canPay={canPay}
            clearBill={clearBill}
            selectedPaymentMode={selectedPaymentMode}
            // onSelectPaymentMode={setSelectedPaymentMode}
            onSelectPaymentMode={(mode) => {
              if (mode === "UPI") {
                setSelectedPaymentMode("UPI");
                setShowUpiModal(true);
              } else {
                setSelectedPaymentMode(mode);
              }
            }}
            onComplete={createOrder}
            loading={creatingOrder}
          />

          {showLastOrder && lastOrder && (
            <LastOrderBar
              order={lastOrder}
              role={role}
              onReprint={() => {}}
              onCancel={() => handleCancelOrder(lastOrder)}
            />
          )}
        </div>
      </div>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setShowRecentOrders(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full
        bg-white border border-slate-300 shadow-lg flex items-center justify-center"
      >
        <Clock size={20} />
      </button>

      <RecentOrdersDrawer
        open={showRecentOrders}
        onClose={() => setShowRecentOrders(false)}
        orders={recentOrders}
        role={role}
        onReprint={() => {}}
        onCancel={handleCancelOrder}
      />

      {/* LOGOUT CONFIRM */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold text-primary mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-text/60 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {showInvoice && invoiceOrderId && (
        <Invoice
          open={showInvoice}
          orderId={invoiceOrderId}
          onClose={() => {
            setShowInvoice(false);
            setInvoiceOrderId(null);
          }}
        />
      )}

      <UpiPaymentModal
        open={showUpiModal}
        total={total}
        onClose={() => {
          setShowUpiModal(false);
          setSelectedPaymentMode("");
        }}
        onPaid={() => {
          setShowUpiModal(false);
          createOrder();
        }}
      />
    </>
  );
};

export default PosScreen;
