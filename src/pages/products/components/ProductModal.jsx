import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const ProductModal = ({ open, onClose, onSuccess, editingProduct }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  // ✅ formData state inside modal
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sellingPrice: "",
    costPrice: "",
    status: true,
  });

  // ✅ when modal open / edit product -> auto fill form
  useEffect(() => {
    if (!open) return;

    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        category: editingProduct.category || "",
        sellingPrice: editingProduct.sellingPrice || "",
        costPrice: editingProduct.costPrice || "",
        status: editingProduct.status ?? true,
      });
    } else {
      setFormData({
        name: "",
        category: "",
        sellingPrice: "",
        costPrice: "",
        status: true,
      });
    }

    setApiError("");
  }, [open, editingProduct]);

  if (!open) return null;

  const handleSaveProduct = async () => {
    setApiError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setApiError("Token not found. Please login again.");
      return;
    }

    // ✅ validation
    if (
      !formData.name ||
      !formData.category ||
      !formData.sellingPrice ||
      !formData.costPrice
    ) {
      setApiError("Please fill in all fields");
      return;
    }

    try {
      setIsSaving(true);

      // ✅ payload for both create + update
      const payload = {
        name: formData.name,
        category: formData.category,
        sellingPrice: Number(formData.sellingPrice),
        costPrice: Number(formData.costPrice),
        isActive: formData.status, // ✅ important (backend expects isActive)
      };

      let res;

      // ✅ EDIT MODE (PUT)
      if (editingProduct?.id) {
        res = await axios.put(`/product/${editingProduct.id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      // ✅ ADD MODE (POST)
      else {
        res = await axios.post("/product/create-product", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const savedProduct = res.data?.data;

      // ✅ send back to parent to refresh list
      onSuccess?.(savedProduct);

      onClose();
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save product",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-primary">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* ✅ error message */}
          {apiError && (
            <div className="text-sm bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg">
              {apiError}
            </div>
          )}

          {/* Item Name */}
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
              disabled={isSaving}
            />
          </div>

          {/* Category */}
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
              disabled={isSaving}
            />
          </div>

          {/* Selling Price */}
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
              disabled={isSaving}
            />
          </div>

          {/* Cost Price */}
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
              disabled={isSaving}
            />
          </div>

          {/* Status */}
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
                disabled={isSaving}
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

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            onClick={handleSaveProduct}
            className="flex-1 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
