import React, { useEffect, useMemo, useState } from "react";
import { Edit2, Plus, Search } from "lucide-react";
import axios from "axios";
import MoneyValue from "../../components/MoneyValue";
import ProductModal from "./components/ProductModal";
import CreateCategoryModal from "./components/CreateCategoryModal";

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const token = localStorage.getItem("token");

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10; // products per page

  /* ---------------- API ---------------- */

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setApiError("");

      const res = await axios.get("/category/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const names = (res.data?.data || [])
        .filter((c) => c.isActive)
        .map((c) => c.name);

      setCategories(["All", ...names]);
    } catch {
      setApiError("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setApiError("");

      const res = await axios.get("/product/get-products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mapped = (res.data?.data || []).map((p) => ({
        id: p._id,
        name: p.name,
        categoryId: p.categoryId?._id || "",
        categoryName: p.categoryId?.name || "Uncategorized",
        sellingPrice: p.sellingPrice,
        costPrice: p.costPrice,
        status: p.isActive,
      }));

      setProducts(mapped);
    } catch {
      setApiError("Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  /* ---------------- Filters ---------------- */

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page]);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Products</h1>
            <p className="text-sm text-text/70 mt-1">
              Manage your product inventory
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg
              text-primary hover:bg-background transition text-sm font-medium"
            >
              <Plus size={16} />
              Category
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
              bg-secondary text-white hover:bg-opacity-90 transition text-sm font-medium"
            >
              <Plus size={16} />
              Product
            </button>
          </div>
        </div>

        {/* Error */}
        {apiError && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-200">
            {apiError}
          </div>
        )}

        {/* Category Chips */}
        <div className="bg-white border rounded-xl p-4">
          <div className="flex gap-2 overflow-x-auto flex-nowrap">
            {loadingCategories ? (
              <span className="text-text/60 text-sm whitespace-nowrap">
                Loading categories…
              </span>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition
            whitespace-nowrap flex-shrink-0
            ${
              activeCategory === cat
                ? "bg-secondary text-white"
                : "bg-background text-text hover:bg-background/70"
            }`}
                >
                  {cat}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border rounded-xl">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveCategory("All");
                }}
                placeholder="Search products…"
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          {/* Loading */}
          {loadingProducts ? (
            <div className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex gap-4 animate-pulse">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="p-10 text-center text-text/60">
              No products added yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background border-b">
                  <tr className="text-text/70">
                    <th className="px-6 py-3 text-left font-medium">Name</th>
                    <th className="px-6 py-3 text-left font-medium">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left font-medium">Selling</th>
                    <th className="px-6 py-3 text-left font-medium">Cost</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {paginatedProducts.map((p) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-background  ${p.status ? "hover:bg-background" : "bg-gray-50 text-gray-400"}`}
                    >
                      <td
                        className={`px-6 py-4 font-medium ${
                          p.status ? "text-primary" : "text-gray-400"
                        }`}
                      >
                        {p.name}
                      </td>

                      <td
                        className={`px-6 py-4 ${p.status ? "" : "text-gray-400"}`}
                      >
                        {p.categoryName}
                      </td>

                      <td
                        className={`px-6 py-4 font-semibold ${
                          p.status ? "" : "text-gray-400"
                        }`}
                      >
                        <MoneyValue amount={p.sellingPrice} size={12} />
                      </td>

                      <td
                        className={`px-6 py-4 ${
                          p.status ? "text-text/70" : "text-gray-400"
                        }`}
                      >
                        <MoneyValue amount={p.costPrice} size={12} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="relative inline-block group">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full cursor-default
        ${
          p.status
            ? "bg-secondary/10 text-secondary"
            : "bg-gray-100 text-gray-500"
        }`}
                          >
                            {p.status ? "Active" : "Inactive"}
                          </span>

                          {/* Tooltip for inactive */}
                          {!p.status && (
                            <div
                              className="absolute z-50 hidden group-hover:block
        left-1/2 -translate-x-1/2 bottom-full mb-2
        whitespace-nowrap rounded-md
        bg-black text-white text-xs px-3 py-1.5 shadow-lg"
                            >
                              Not available in POS
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setShowModal(true);
                          }}
                          className="p-2 text-secondary hover:bg-secondary/10 rounded-lg"
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
                  <span className="text-sm text-text/60">
                    Page {page} of {totalPages}
                  </span>

                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-3 py-1 border rounded-lg text-sm
        disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Prev
                    </button>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-3 py-1 border rounded-lg text-sm
        disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProductModal
        open={showModal}
        onClose={() => setShowModal(false)}
        editingProduct={editingProduct}
        onSuccess={() => {
          fetchProducts();
          fetchCategories();
        }}
      />

      <CreateCategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSuccess={() => {
          fetchCategories();
          setActiveCategory("All");
        }}
      />
    </div>
  );
};

export default ProductsPage;
