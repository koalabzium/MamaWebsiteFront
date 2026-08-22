import { useState, useEffect, useCallback } from "react";

// Shared behavior behind the near-identical admin CRUD screens
// (manageCategories.jsx, managePlaces.jsx, manageReaders.jsx): load a
// {id, name} list, add-on-Enter, click-to-edit-then-Enter-to-save, delete.
// Each screen keeps its own ~40-line render and just wires this hook to its
// own service functions.
const useManagedList = ({ getAll, add, update, remove }) => {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await getAll();
      const sorted = [...data].sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
      setItems(sorted);
    };
    load();
  }, [getAll]);

  const handleAdd = useCallback(
    async (e) => {
      if (e.key !== "Enter" || !newName) return;
      const name = newName;
      setNewName("");
      // Use the server-assigned item (with its real id) rather than
      // optimistically inserting a placeholder — the original code pushed
      // {id: null, ...}, which broke editing/deleting a just-added item
      // until the next full page load.
      const { data: created } = await add(name);
      setItems((prev) => [...prev, created]);
    },
    [add, newName]
  );

  const startEdit = useCallback((item) => {
    setEditingId(item.id);
    setEditedName(item.name);
  }, []);

  const handleEdit = useCallback(
    async (e, item) => {
      if (e.key !== "Enter") return;
      const name = editedName;
      setEditingId(null);
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, name } : i))
      );
      await update(item.id, name);
    },
    [editedName, update]
  );

  const handleDelete = useCallback(
    async (item) => {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      await remove(item.id);
    },
    [remove]
  );

  return {
    items,
    editingId,
    editedName,
    setEditedName,
    newName,
    setNewName,
    startEdit,
    handleAdd,
    handleEdit,
    handleDelete,
  };
};

export default useManagedList;
