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
    <div style={{ padding: 20 }}>
      <div className="card category">
        <div className="card-body">
          <h2>Zarządzaj kategoriami </h2>
          <table className="table table-hover">
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  {editingId === category.id ? (
                    <input
                      className="form-control"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => handleEdit(e, category)}
                      noValidate
                    />
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
                <input
                  className="form-control"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleAdd}
                  placeholder="Nowa kategoria..."
                  noValidate
                />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
