import React from "react";
import {
  getPlaces,
  deletePlace,
  updatePlace,
  addPlace,
} from "../services/placeService";
import useManagedList from "../hooks/useManagedList";

const ManagePlaces = () => {
  const {
    items: places,
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
    getAll: getPlaces,
    add: addPlace,
    update: updatePlace,
    remove: deletePlace,
  });

  return (
    <div className="admin-section">
      <div className="card place">
        <div className="card-body">
          <h5 className="mb-1">Lokalizacje</h5>
          <p className="text-muted small mb-3">Kliknij nazwę, żeby ją zmienić (Enter zapisuje). Nową lokalizację dodasz w ostatnim wierszu.</p>
          <table className="table table-hover">
            <tbody>
              {places.map((place) => (
                <tr key={place.id}>
                  {editingId === place.id ? (
                    <td>
                      <input
                      className="form-control"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => handleEdit(e, place)}
                      noValidate
                    />
                    </td>
                  ) : (
                    <td onClick={() => startEdit(place)}>{place.name}</td>
                  )}

                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(place)}
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

export default ManagePlaces;
