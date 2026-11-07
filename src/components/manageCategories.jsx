import React from "react";
import {
  getCategories,
  deleteCategory,
  updateCategory,
  addCategory,
} from "../services/categoryService";
import useManagedList from "../hooks/useManagedList";

const ManageCategories = () => {
  const {
    items: categories,
    editingId,
    editedName,
    setEditedName,
    newName,
    setNewName,
    startEdit,
    handleAdd,
    handleEdit,
    handleDelete,
  } = useManagedList({
    getAll: getCategories,
    add: addCategory,
    update: updateCategory,
    remove: deleteCategory,
  });

  return (
    <div className="admin-section">
      <div className="card admin-section__card">
        <div className="card-body">
          <h5 className="mb-1">Kategorie</h5>
          <p className="text-muted small mb-3">Kliknij nazwę, żeby ją zmienić (Enter zapisuje). Nową kategorię dodasz w ostatnim wierszu.</p>
          <table className="table table-hover">
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  {editingId === category.id ? (
                    <td>
                      <input
                      className="form-control"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => handleEdit(e, category)}
                      noValidate
                    />
                    </td>
                  ) : (
                    <td onClick={() => startEdit(category)}>
                      {category.name}
                    </td>
                  )}

                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(category)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2}>
                  <input
                  className="form-control"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleAdd}
                  placeholder="Nowa kategoria..."
                  noValidate
                />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
