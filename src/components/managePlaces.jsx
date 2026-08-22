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
    <div style={{ padding: 20 }}>
      <div className="card place">
        <div className="card-body">
          <h2>Zarządzaj lokalizacjami </h2>
          <table className="table table-hover">
            <tbody>
              {places.map((place) => (
                <tr key={place.id}>
                  {editingId === place.id ? (
                    <input
                      className="form-control"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onKeyDown={(e) => handleEdit(e, place)}
                      noValidate
                    />
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

export default ManagePlaces;
