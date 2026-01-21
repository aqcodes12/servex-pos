// import React, { useState } from "react";
// import { Edit2, Trash2, Plus, X, Search } from "lucide-react";
// import MoneyValue from "../../components/MoneyValue";
// import ProductModal from "./components/ProductModal";

// const ProductsPage = () => {
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       name: "Espresso",
//       category: "Coffee",
//       sellingPrice: 3.5,
//       costPrice: 1.2,
//       status: true,
//     },
//     {
//       id: 2,
//       name: "Cappuccino",
//       category: "Coffee",
//       sellingPrice: 4.5,
//       costPrice: 1.8,
//       status: true,
//     },
//     {
//       id: 3,
//       name: "Croissant",
//       category: "Pastry",
//       sellingPrice: 3.0,
//       costPrice: 1.0,
//       status: true,
//     },
//     {
//       id: 4,
//       name: "Blueberry Muffin",
//       category: "Pastry",
//       sellingPrice: 3.5,
//       costPrice: 1.2,
//       status: false,
//     },
//   ]);

//   const [showModal, setShowModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       setProducts(products.filter((p) => p.id !== id));
//     }
//   };

//   const handleAddNew = () => {
//     setEditingProduct(null);
//     setShowModal(true);
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setShowModal(true);
//   };

//   const handleToggleStatus = (id) => {
//     setProducts(
//       products.map((p) => (p.id === id ? { ...p, status: !p.status } : p)),
//     );
//   };

//   // const filteredProducts = products.filter(
//   //   (p) =>
//   //     p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //     p.category.toLowerCase().includes(searchTerm.toLowerCase())
//   // );
//   const categories = ["All", ...new Set(products.map((p) => p.category))];

//   const filteredProducts = products.filter((p) => {
//     const matchesSearch =
//       p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       p.category.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategory =
//       activeCategory === "All" || p.category === activeCategory;

//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-primary mb-2">Products</h1>
//             <p className="text-text opacity-70">
//               Manage your product inventory
//             </p>
//           </div>
//           <button
//             onClick={handleAddNew}
//             className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium shadow-sm"
//           >
//             <Plus className="w-5 h-5" />
//             Add Product
//           </button>
//         </div>

//         <div className="px-4 pt-4 border-b border-gray-100 bg-white rounded-2xl">
//           <div className="flex gap-2 overflow-x-auto pb-2">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setActiveCategory(category)}
//                 className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all
//           ${
//             activeCategory === category
//               ? "bg-secondary text-white shadow-sm"
//               : "bg-gray-100 text-text hover:bg-gray-200"
//           }
//         `}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="p-4 border-b border-gray-100">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setActiveCategory("All");
//                 }}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Item Name
//                   </th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Category
//                   </th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Selling Price
//                   </th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Cost Price
//                   </th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Status
//                   </th>
//                   <th className="px-6 py-4 text-left text-base font-semibold text-primary">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {filteredProducts.map((product) => (
//                   <tr
//                     key={product.id}
//                     className="hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="px-6 py-4 text-text font-bold text-lg">
//                       {product.name}
//                     </td>
//                     <td className="px-6 py-4 text-text text-lg">
//                       {product.category}
//                     </td>
//                     <td className="px-6 py-4 text-lg font-semibold">
//                       <MoneyValue amount={product.sellingPrice} size={12} />
//                     </td>
//                     <td className="px-6 py-4 text-lg font-semibold">
//                       <MoneyValue amount={product.costPrice} size={12} />
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => handleToggleStatus(product.id)}
//                         className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                           product.status ? "bg-secondary" : "bg-gray-300"
//                         }`}
//                       >
//                         <span
//                           className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                             product.status ? "translate-x-6" : "translate-x-1"
//                           }`}
//                         />
//                       </button>
//                       <span
//                         className={`ml-2 text-sm font-medium ${
//                           product.status ? "text-secondary" : "text-gray-500"
//                         }`}
//                       >
//                         {product.status ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <button
//                           // onClick={() => handleEdit(product)}
//                           className="p-2 text-secondary hover:bg-secondary hover:bg-opacity-10 rounded-lg transition-colors"
//                         >
//                           <Edit2 className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(product.id)}
//                           className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {filteredProducts.length === 0 && (
//             <div className="text-center py-12 text-gray-500">
//               No products found
//             </div>
//           )}
//         </div>
//       </div>

//       <ProductModal
//         open={showModal}
//         onClose={() => setShowModal(false)}
//         editingProduct={editingProduct}
//       />
//     </div>
//   );
// };

// export default ProductsPage;

import React, { useEffect, useState } from "react";
import { Edit2, Trash2, Plus, Search, Trash2Icon } from "lucide-react";
import axios from "axios";
import MoneyValue from "../../components/MoneyValue";
import ProductModal from "./components/ProductModal";

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

  const token = localStorage.getItem("token");

  // ✅ fetch categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setApiError("");

      const res = await axios.get("/product/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const apiCategories = res.data?.data || [];
      setCategories(["All", ...apiCategories]);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  // ✅ fetch products
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

      // ✅ Map backend format to UI format
      const mapped = apiProducts.map((p) => ({
        id: p._id,
        name: p.name,
        category: p.category,
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Products</h1>
            <p className="text-text opacity-70">
              Manage your product inventory
            </p>
          </div>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
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
    </div>
  );
};

export default ProductsPage;
