import React, { useState, useEffect } from "react";
import Input from "./common/input";
import { addBorrowing } from "../services/borrowingService";
import { getReaders } from "../services/readerService";
import Select from "react-select";

const BorrowingForm = ({ book, onDoneBorrow }) => {
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [personId, setPersonId] = useState(null);
  const [personName, setPersonName] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const loadReaders = async () => {
      const { data: readers } = await getReaders();
      const sorted = readers
        .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
        .map((reader) => ({ value: reader.id, label: reader.name }));
      setOptions(sorted);
    };
    loadReaders();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    addBorrowing({
      bookId: book.id,
      readerId: personId,
      readerName: personName,
      date,
      quantity,
    });

    onDoneBorrow(null);
  };

  const handleSelect = (e) => {
    setPersonId(e.value);
    setPersonName(e.label);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label>Wybierz czytelnika_czkę</label>
        <Select options={options} onChange={handleSelect} />
      </div>

      <Input
        label="Data"
        name="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="date"
      />
      <div className="form-group">
        <label>Wypożyczana ilość</label>
        <input
          className="form-control"
          name="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          max={book.available}
          min={1}
          noValidate
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Zatwierdź
      </button>
    </form>
  );
};

export default BorrowingForm;
