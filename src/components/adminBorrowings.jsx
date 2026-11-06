import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Alert, Spinner } from "react-bootstrap";
import Select from "react-select";
import { AssignmentReturn } from "@material-ui/icons/";
import { getBorrowings, handleCancelBorrowing } from "../services/borrowingService";
import { getReaders } from "../services/readerService";
import { getPlaces } from "../services/placeService";
import { confirmEndBorrowing } from "./common/confirmAction";

const byName = (a, b) => (a.name || "").localeCompare(b.name || "", "pl");

// All borrowings across the library, filterable by reader and by the
// borrowed book's location. Shows only active (not yet returned) borrowings
// unless "show ended" is ticked.
const AdminBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [readers, setReaders] = useState([]);
  const [places, setPlaces] = useState([]);
  const [readerFilter, setReaderFilter] = useState(null);
  const [placeFilter, setPlaceFilter] = useState(null);
  const [showEnded, setShowEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    getReaders().then(({ data }) => setReaders([...data].sort(byName)));
    getPlaces().then(({ data }) => setPlaces([...data].sort(byName)));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getBorrowings({ active: !showEnded });
      setBorrowings(data);
    } catch (err) {
      setStatus({ variant: "danger", message: "Nie można pobrać wypożyczeń :(" });
    } finally {
      setLoading(false);
    }
  }, [showEnded]);

  useEffect(() => {
    load();
  }, [load]);

  const placeNames = useMemo(() => new Map(places.map((p) => [p.id, p.name])), [places]);
  const readerOptions = readers.map((r) => ({ value: r.id, label: r.name }));
  const placeOptions = places.map((p) => ({ value: p.id, label: p.name }));

  const visible = useMemo(
    () =>
      borrowings
        .filter((b) => !readerFilter || b.readerId === readerFilter.value)
        .filter((b) => !placeFilter || b.bookPlace === placeFilter.value)
        // Active first, then newest first.
        .sort((a, b) =>
          a.active !== b.active ? (a.active ? -1 : 1) : (b.date || "").localeCompare(a.date || "")
        ),
    [borrowings, readerFilter, placeFilter]
  );

  const endBorrowing = (b) =>
    confirmEndBorrowing(b, async () => {
      setPendingId(b.id);
      try {
        await handleCancelBorrowing(b);
        setBorrowings((prev) =>
          showEnded
            ? prev.map((x) => (x.id === b.id ? { ...x, active: false } : x))
            : prev.filter((x) => x.id !== b.id)
        );
        setStatus({
          variant: "success",
          message: `Zakończono wypożyczenie „${b.bookTitle}” — ${b.readerName}.`,
        });
      } catch (err) {
        setStatus({ variant: "danger", message: "Nie udało się zakończyć wypożyczenia." });
      } finally {
        setPendingId(null);
      }
    });

  return (
    <div className="admin-borrowings">
      <div className="admin-borrowings__filters">
        <div className="admin-borrowings__filter">
          <label htmlFor="filter-reader">Czytelniczka / czytelnik</label>
          <Select
            inputId="filter-reader"
            options={readerOptions}
            value={readerFilter}
            onChange={setReaderFilter}
            isClearable
            placeholder="Wszyscy"
          />
        </div>
        <div className="admin-borrowings__filter">
          <label htmlFor="filter-place">Lokalizacja</label>
          <Select
            inputId="filter-place"
            options={placeOptions}
            value={placeFilter}
            onChange={setPlaceFilter}
            isClearable
            placeholder="Wszystkie"
          />
        </div>
        <div className="custom-control custom-switch admin-borrowings__toggle">
          <input
            type="checkbox"
            className="custom-control-input"
            id="show-ended"
            checked={showEnded}
            onChange={(e) => setShowEnded(e.target.checked)}
          />
          <label className="custom-control-label" htmlFor="show-ended">
            Pokaż zakończone
          </label>
        </div>
      </div>

      {status && (
        <Alert variant={status.variant} onClose={() => setStatus(null)} dismissible>
          {status.message}
        </Alert>
      )}

      {loading ? (
        <div className="d-flex justify-content-center p-4">
          <Spinner animation="border" />
        </div>
      ) : visible.length === 0 ? (
        <div className="text-muted p-3">
          {showEnded ? "Brak wypożyczeń." : "Brak aktywnych wypożyczeń."}
        </div>
      ) : (
        <>
          <div className="text-muted small mb-2">Wypożyczeń: {visible.length}</div>
          {/* Reuses the books table's mobile-first styles: stacked cards on
              phones, a regular table from md up. */}
          <table className="table books-table">
            <thead>
              <tr>
                <th>Książka</th>
                <th>Czytelniczka / czytelnik</th>
                <th>Data</th>
                <th>Lokalizacja</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <tr key={b.id} className={b.active ? "" : "text-muted"}>
                  <td data-label="Książka">
                    <div className="font-weight-bold">{b.bookTitle}</div>
                    {b.bookAuthor && <div className="small text-muted">{b.bookAuthor}</div>}
                  </td>
                  <td data-label="Czytelnik">{b.readerName}</td>
                  <td data-label="Data">{b.date || "—"}</td>
                  <td data-label="Lokalizacja">{placeNames.get(b.bookPlace) || "—"}</td>
                  <td data-label="Status">
                    {b.active ? (
                      <span className="badge badge-success">Aktywne</span>
                    ) : (
                      <span className="badge badge-secondary">Zakończone</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    {b.active && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => endBorrowing(b)}
                        disabled={pendingId === b.id}
                        title="Zakończ wypożyczenie (zwrot)"
                      >
                        <AssignmentReturn fontSize="small" /> {pendingId === b.id ? "…" : "Zwrot"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminBorrowings;
