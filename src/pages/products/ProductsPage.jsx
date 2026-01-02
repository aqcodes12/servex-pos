import React, { useState } from "react";
import { Edit2, Trash2, Plus, X, Search } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Espresso",
      category: "Coffee",
      sellingPrice: 3.5,
      costPrice: 1.2,
      status: true,
    },
    {
      id: 2,
      name: "Cappuccino",
      category: "Coffee",
      sellingPrice: 4.5,
      costPrice: 1.8,
      status: true,
    },
    {
      id: 3,
      name: "Croissant",
      category: "Pastry",
      sellingPrice: 3.0,
      costPrice: 1.0,
      status: true,
    },
    {
      id: 4,
      name: "Blueberry Muffin",
      category: "Pastry",
      sellingPrice: 3.5,
      costPrice: 1.2,
      status: false,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sellingPrice: "",
    costPrice: "",
    status: true,
  });

  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      sellingPrice: "",
      costPrice: "",
      status: true,
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      sellingPrice: product.sellingPrice,
      costPrice: product.costPrice,
      status: product.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, status: !p.status } : p))
    );
  };

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.sellingPrice ||
      !formData.costPrice
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                sellingPrice: parseFloat(formData.sellingPrice),
                costPrice: parseFloat(formData.costPrice),
              }
            : p
        )
      );
    } else {
      const newProduct = {
        id: Math.max(...products.map((p) => p.id), 0) + 1,
        ...formData,
        sellingPrice: parseFloat(formData.sellingPrice),
        costPrice: parseFloat(formData.costPrice),
      };
      setProducts([...products, newProduct]);
    }

    setShowModal(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                    Item Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                    Selling Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                    Cost Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
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
                    <td className="px-6 py-4 text-text font-medium">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-text">{product.category}</td>
                    <td className="px-6 py-4 text-text">
                      ${product.sellingPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-text">
                      ${product.costPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          product.status ? "bg-secondary" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            product.status ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span
                        className={`ml-2 text-sm font-medium ${
                          product.status ? "text-secondary" : "text-gray-500"
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
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-primary">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="Enter category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Selling Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, sellingPrice: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Cost Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, costPrice: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Status
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setFormData({ ...formData, status: !formData.status })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.status ? "bg-secondary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.status ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-sm font-medium ${
                      formData.status ? "text-secondary" : "text-gray-500"
                    }`}
                  >
                    {formData.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
