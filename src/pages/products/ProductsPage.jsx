import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, Search, Trash2Icon } from "lucide-react";
import axios from "axios";
import MoneyValue from "../../components/MoneyValue";
import ProductModal from "./components/ProductModal";
import CreateCategoryModal from "./components/CreateCategoryModal";

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const [products, setProducts] = useState([]); // ✅ from API
  const [categories, setCategories] = useState(["All"]); // ✅ from API

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ fetch categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setApiError("");

      const res = await axios.get("/category/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const apiCategories = res.data?.data || [];

      // 🔑 map objects → names
      const categoryNames = apiCategories
        .filter((c) => c.isActive)
        .map((c) => c.name);

      setCategories(["All", ...categoryNames]);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      setApiError("");

      const res = await axios.get("/product/get-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const apiProducts = res.data?.data || [];

      const mapped = apiProducts.map((p) => ({
        id: p._id,
        name: p.name,

        // 🔑 normalize category
        category:
          p.categoryId?.name || // NEW API
          p.category || // OLD API
          "Uncategorized",

        categoryId: p.categoryId?._id || null,

        sellingPrice: p.sellingPrice,
        costPrice: p.costPrice,
        status: p.isActive,
      }));

      setProducts(mapped);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // ✅ load products + categories when page mounts
  useEffect(() => {
    if (!token) {
      setApiError("Token not found. Please login again.");
      return;
    }

    fetchCategories();
    fetchProducts();
  }, []);

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">Products</h1>
              <p className="text-text opacity-60 text-sm">
                Manage your product inventory
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center justify-center gap-2 bg-white text-primary px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all font-medium shadow-sm border border-gray-200 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>

              <button
                onClick={handleAddNew}
                className="flex items-center justify-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-all font-medium shadow-sm whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {apiError && (
          <div className="mb-4 bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Categories */}
        <div className="px-4 pt-4 border-b border-gray-100 bg-white rounded-2xl">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {loadingCategories ? (
              <div className="text-gray-500 py-2">Loading categories...</div>
            ) : (
              categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      activeCategory === category
                        ? "bg-secondary text-white shadow-sm"
                        : "bg-gray-100 text-text hover:bg-gray-200"
                    }`}
                >
                  {category}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveCategory("All");
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          {loadingProducts ? (
            <div className="text-center py-12 text-gray-500">
              Loading products...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Item Name
                      </th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Selling Price
                      </th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Cost Price
                      </th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-primary">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-text font-bold text-lg">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-text text-lg">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-lg font-semibold">
                          <MoneyValue amount={product.sellingPrice} size={12} />
                        </td>
                        <td className="px-6 py-4 text-lg font-semibold">
                          <MoneyValue amount={product.costPrice} size={12} />
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`text-sm font-medium ${
                              product.status
                                ? "text-secondary"
                                : "text-gray-500"
                            }`}
                          >
                            {product.status ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-secondary hover:bg-secondary hover:bg-opacity-10 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No products found
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <ProductModal
        open={showModal}
        onClose={() => setShowModal(false)}
        editingProduct={editingProduct}
        onSuccess={(createdProduct) => {
          // ✅ refresh both products & categories after adding new product
          fetchProducts();
          fetchCategories();
        }}
      />

      <CreateCategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSuccess={() => {
          fetchCategories(); // refresh chips
          setActiveCategory("All");
        }}
      />
    </div>
  );
};

export default ProductsPage;
