import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Check, X } from "lucide-react";

const CategoriesPage = () => {
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  /* ---------------- API ---------------- */

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

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Categories</h1>
            <p className="text-sm text-text/70 mt-1">
              Manage product categories
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
            bg-secondary text-white hover:bg-opacity-90 transition
            text-sm font-medium"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>

        {/* Error */}
        {apiError && (
          <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border rounded-xl overflow-hidden">
          {loading ? (
            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="px-6 py-4 flex justify-between animate-pulse"
                >
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center text-text/60">
              No categories created yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-background border-b">
                  <tr className="text-text/70">
                    <th className="px-6 py-3 text-left font-medium">Name</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-background">
                      <td className="px-6 py-4 font-medium text-primary">
                        {editingId === cat._id ? (
                          <input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full px-3 py-1.5 border rounded-lg
                            focus:ring-2 focus:ring-secondary"
                          />
                        ) : (
                          cat.name
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full
                          ${
                            cat.isActive
                              ? "bg-secondary/10 text-secondary"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {editingId === cat._id ? (
                          <>
                            <button
                              onClick={() => updateCategory(cat._id)}
                              className="p-2 text-secondary hover:bg-secondary/10 rounded-lg"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditingName("");
                              }}
                              className="p-2 text-text/60 hover:bg-background rounded-lg"
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
                              className="p-2 text-secondary hover:bg-secondary/10 rounded-lg"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() =>
                                toggleStatus(cat._id, cat.isActive)
                              }
                              className={`text-xs font-medium px-3 py-1 rounded-lg
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
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-sm p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Add Category
            </h2>

            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
              className="w-full px-4 py-2 border rounded-lg
              focus:ring-2 focus:ring-secondary mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategory("");
                }}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-background"
              >
                Cancel
              </button>

              <button
                onClick={createCategory}
                disabled={creating}
                className="px-4 py-2 text-sm rounded-lg
                bg-secondary text-white hover:bg-opacity-90
                disabled:opacity-50"
              >
                {creating ? "Adding…" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
