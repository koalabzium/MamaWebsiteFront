import React, { useState, useCallback } from "react";
import {
  getReaders,
  deleteReader,
  updateReader,
  addReader,
  getReadersBorrowings,
} from "../services/readerService";
import BorrowingsModal from "./borrowingsModal";
import { handleCancelBorrowing } from "../services/borrowingService";
import { MenuBook } from "@material-ui/icons/";
import useManagedList from "../hooks/useManagedList";

// readers' POST response is shaped { message: reader } rather than the
// created reader directly (unlike categories/places) — normalize it here so
// useManagedList can stay shape-agnostic.
const addReaderNormalized = async (name) => {
  const { data } = await addReader(name);
  return { data: data.message };
};

const ManageReaders = () => {
  const {
    items: readers,
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
    getAll: getReaders,
    add: addReaderNormalized,
    update: updateReader,
    remove: deleteReader,
  });

  const [borrowings, setBorrowings] = useState(null);

  const handleOpenBorrowingDetails = useCallback(async (reader) => {
    const { data } = await getReadersBorrowings(reader.id);
    setBorrowings(data);
  }, []);

  const onCancelBorrowing = useCallback((toDelete) => {
    handleCancelBorrowing(toDelete).then(() => {
      setBorrowings((prev) => prev.filter((b) => b !== toDelete));
    });
  }, []);

  return (
    <React.Fragment>
      <div style={{ padding: 20 }}>
        <div className="card category">
          <div className="card-body">
            <h2>Czytelniczki i czytelnicy </h2>
            <table className="table table-hover">
              <tbody>
                {readers.map((reader) => (
                  <tr key={reader.id}>
                    {editingId === reader.id ? (
                      <input
                        className="form-control"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => handleEdit(e, reader)}
                        noValidate
                      />
                    ) : (
                      <td onClick={() => startEdit(reader)}>{reader.name}</td>
                    )}

                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(reader)}
                      >
                        X
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleOpenBorrowingDetails(reader)}
                      >
                        <MenuBook />
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
                    placeholder="Nowa czytelniczka..."
                    noValidate
                  />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <BorrowingsModal
        borrowings={borrowings}
        onCancelBorrowing={onCancelBorrowing}
        onHide={() => setBorrowings(null)}
      />
    </React.Fragment>
  );
};

export default ManageReaders;
