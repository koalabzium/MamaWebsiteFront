import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

// Small yes/no confirmation dialog for destructive actions.
const confirmAction = ({ title, message, confirmLabel = "Tak", onConfirm }) =>
  confirmAlert({
    title,
    message,
    buttons: [
      { label: confirmLabel, onClick: onConfirm },
      { label: "Anuluj", onClick: () => {} },
    ],
  });

export const confirmEndBorrowing = (borrowing, onConfirm) =>
  confirmAction({
    title: "Zakończyć wypożyczenie?",
    message: `„${borrowing.bookTitle || "Książka"}” — ${borrowing.readerName || "czytelnik"}${
      borrowing.date ? ` (${borrowing.date})` : ""
    }. Egzemplarz wróci do dostępnych.`,
    confirmLabel: "Tak, zakończ",
    onConfirm,
  });

export default confirmAction;
