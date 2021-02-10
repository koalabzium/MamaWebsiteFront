import React, {Component} from "react";
import Input from "./common/input";
import {addBorrowing} from "../services/borrowingService";
import {getReaders} from "../services/readerService";
import Select from "react-select";

class BorrowingForm extends Component {
    state = {
        date: "",
        quantity: 1,
        personId: null,
        personName: "",
        options: [],
    };

    handleSubmit = (e) => {
        const {date, quantity, personId, personName} = this.state;
        const {book} = this.props;
        e.preventDefault();


        addBorrowing({
            bookId: book.id,
            readerId: personId,
            readerName: personName,
            date: date,
            quantity: quantity,
        });

        this.props.onDoneBorrow(null);
    };

    async componentDidMount() {
        this.setState({book: this.props.book});
        const {data: readers} = await getReaders();
        const options = readers
            .sort(function (a, b) {
                return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
            })
            .map((reader) => {
                return {value: reader.id, label: reader.name};
            });
        this.setState({options});
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    handleSelect = (e) => {
        this.setState({personId: e.value, personName: e.label});
    };

    render() {
        const {date, quantity, options} = this.state;
        return (
            <React.Fragment>
                <form onSubmit={this.handleSubmit} noValidate>
                    <div className="form-group">
                        <label>Wybierz czytelnika_czkę</label>
                        <Select options={options} onChange={this.handleSelect}/>
                    </div>

                    <Input
                        label="Data"
                        name="date"
                        value={date}
                        onChange={this.handleChange}
                        type="date"
                    />
                    <div className="form-group">
                        <label>Wypożyczana ilość</label>
                        <input
                            className="form-control"
                            name="quantity"
                            value={quantity}
                            onChange={this.handleChange}
                            type="number"
                            max={this.props.book.available}
                            min={1}
                            noValidate
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Zatwierdź
                    </button>
                </form>
            </React.Fragment>
        );
    }
}

export default BorrowingForm;
