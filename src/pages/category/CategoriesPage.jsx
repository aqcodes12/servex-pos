import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Check, X } from "lucide-react";

const CategoriesPage = () => {
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ✨ Add category modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [creating, setCreating] = useState(false);

  // ✏️ Edit
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  /* ---------------- API CALLS ---------------- */

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setApiError("");

      const res = await axios.get("/category/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategories(res.data?.data || []);
    } catch {
      setApiError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      setCreating(true);

      await axios.post(
        "/category/create-category",
        { name: newCategory },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNewCategory("");
      setShowAddModal(false);
      fetchCategories();
    } catch {
      setApiError("Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const updateCategory = async (id) => {
    if (!editingName.trim()) return;

    try {
      await axios.patch(
        `/category/${id}`,
        { name: editingName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch {
      setApiError("Failed to update category");
    }
  };

  const toggleStatus = async (id, isActive) => {
    try {
      await axios.patch(
        `/category/${id}/status`,
        { isActive: !isActive },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchCategories();
    } catch {
      setApiError("Failed to update status");
    }
  };

  /* ---------------- LIFE CYCLE ---------------- */

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Category Management</h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {apiError && (
        <div className="mb-4 bg-red-50 text-red-600 px-4 py-2 rounded-lg">
          {apiError}
        </div>
      )}

      {/* Categories table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No categories found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="px-4 py-3">
                    {editingId === cat._id ? (
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="px-2 py-1 border rounded-md w-full"
                      />
                    ) : (
                      <span className="font-medium">{cat.name}</span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${
                          cat.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right space-x-2">
                    {editingId === cat._id ? (
                      <>
                        <button
                          onClick={() => updateCategory(cat._id)}
                          className="text-green-600"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingName("");
                          }}
                          className="text-gray-500"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(cat._id);
                            setEditingName(cat.name);
                          }}
                          className="text-blue-600"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => toggleStatus(cat._id, cat.isActive)}
                          className={`px-3 py-1 rounded-md text-sm
                            ${
                              cat.isActive
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                        >
                          {cat.isActive ? "Disable" : "Enable"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔥 Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Add Category</h2>

            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-teal-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategory("");
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={createCategory}
                disabled={creating}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                {creating ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
