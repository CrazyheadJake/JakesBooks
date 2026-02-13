import { useState } from "react";
import type { Book } from "../types/book";
const API_URL = import.meta.env.VITE_API_URL;

function BookEntry({ book, setBooks, setMessage, id}: { book: Book | null, setBooks: (x: Book[]) => void, setMessage: (x: string) => void, id: string }) {
    const [ bookError, setBookError ] = useState("");
    const [ loading, setLoading ] = useState(false);

    async function addBook(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const newBook = parseBookForm(form);
        if ("error" in newBook) {
            setBookError(newBook.error);
            return;
        }
        setLoading(true);
        form.querySelector("[type=submit]")?.setAttribute("disabled", "true");
        let res;
        if (book && book._id) {
            res = await fetch(API_URL + "/api/updateBook", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ bookId: book._id, ...newBook })
            });
        }
        else {
            res = await fetch(API_URL + "/api/addBook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(newBook)
            });
        }
        console.log(res);
        const body = await res.json();
        if (res.ok) {
            if (book) {
                const modalClose = document.getElementById("editBookEntry-closeModal");
                modalClose?.click();
            }
            else {
                const modalClose = document.getElementById("newBookEntry-closeModal");
                modalClose?.click();
            }
            setMessage(body.message);
            setBookError("");
            const bookres = await fetch(API_URL + '/api/getBooks', { credentials: "include" });
            const bookjson = await bookres.json();
            setBooks(bookjson);
            setTimeout(() => form.reset(), 200)
        }
        else {
            setBookError(body.error);
        }
        form.querySelector("[type=submit]")?.removeAttribute("disabled");
        setLoading(false);
    }

    async function deleteEntry() {
        if (!book || !book._id) {
            return;
        }
        const res = await fetch(API_URL + "/api/deleteBook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ bookId: book._id })
        });
        const body = await res.json();

        if (res.ok) {
            setMessage(body.message);
            const modalClose = document.getElementById("editBookEntry-closeModal");
            const newBooks = await fetch(API_URL + '/api/getBooks', { credentials: "include"});
            const json = await newBooks.json();
            setBooks(json);
            modalClose?.click();
        }
        else {
            console.log(body);
            setBookError(body.error);
        }
    }

    return (
    <div className="modal fade" id={id} tabIndex={-1} role="dialog" key={book ? book._id : "new"}>
    <div className="modal-dialog" role="document">
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title">{book ? "Edit Book Entry" : "New Book Entry"}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div className="modal-body">
            <form onSubmit={addBook}>
                <div className="form-group">
                    <label className="required-label" htmlFor="title required-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        placeholder="Enter title"
                        required={true}
                        defaultValue={book ? book.title : ""}
                    />
                </div>
                <div className="form-group">
                    <label className="required-label" htmlFor="author">Author</label>
                    <input
                        type="text"
                        className="form-control"
                        id="author"
                        name="author"
                        placeholder="Enter full author name"
                        required={true}
                        defaultValue={book ? book.author : ""}
                    />
                </div>
                <div className="form-row">
                    <div className="form-group col-9">
                        <label htmlFor="series">Series</label>
                        <input
                            type="text"
                            className="form-control"
                            id="series"
                            name="series"
                            placeholder="Enter series name if applicable"
                            defaultValue={book ? book.series : ""}
                        />
                    </div>
                    <div className="form-group col-3">
                        <label htmlFor="seriesNumber">Number</label>
                        <input
                            type="number"
                            step="any"
                            className="form-control"
                            id="seriesNumber"
                            name="seriesNumber"
                            defaultValue={book ? book.seriesNumber : ""}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-3">
                        <label className="required-label" htmlFor="rating" >Rating</label>
                        <input
                            type="number"
                            className="form-control"
                            id="rating"
                            name="rating"
                            placeholder="0-100"
                            required={true}
                            defaultValue={book ? book.rating : ""}
                        />
                    </div>
                    <div className="form-group col">
                        <label className="required-label" htmlFor="genre">Genre</label>
                        <select id={id + "-genre"} name="genre" className="form-control" required={true}>
                            <option>Sci-fi</option>
                            <option>Fantasy</option>
                            <option>High Fantasy</option>
                            <option>Urban Fantasy</option>
                            <option>Dark Fantasy</option>
                            <option>Post-apocalyptic</option>
                            <option>Romance</option>
                            <option>Dystopian</option>
                            <option>Nonfiction</option>
                            <option>Realistic Fiction</option>
                            <option>Zombie</option>
                            <option>Super Hero</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col">
                        <label className="required-label" htmlFor="month">Month</label>
                        <select id={id + "-month"} name="month" className="form-control" itemType="number" required={true} >
                            <option value="1" selected={book ? new Date(book.date).getMonth() === 0 : true}>January</option>
                            <option value="2" selected={book ? new Date(book.date).getMonth() === 1 : false}>February</option>
                            <option value="3" selected={book ? new Date(book.date).getMonth() === 2 : false}>March</option>
                            <option value="4" selected={book ? new Date(book.date).getMonth() === 3 : false}>April</option>
                            <option value="5" selected={book ? new Date(book.date).getMonth() === 4 : false}>May</option>
                            <option value="6" selected={book ? new Date(book.date).getMonth() === 5 : false}>June</option>
                            <option value="7" selected={book ? new Date(book.date).getMonth() === 6 : false}>July</option>
                            <option value="8" selected={book ? new Date(book.date).getMonth() === 7 : false}>August</option>
                            <option value="9" selected={book ? new Date(book.date).getMonth() === 8 : false}>September</option>
                            <option value="10" selected={book ? new Date(book.date).getMonth() === 9 : false}>October</option>
                            <option value="11" selected={book ? new Date(book.date).getMonth() === 10 : false}>November</option>
                            <option value="12" selected={book ? new Date(book.date).getMonth() === 11 : false}>December</option>
                        </select>
                    </div>

                    <div className="form-group col">
                        <label className="required-label" htmlFor="day">Day</label>
                        <input type="number"
                                className="form-control"
                                id="day"
                                name="day"
                                required={true}
                                defaultValue={book ? new Date(book.date).getDate() : ""}
                            />
                    </div>

                    <div className="form-group col">
                        <label className="required-label" htmlFor="year">Year</label>
                        <input type="number"
                            className="form-control"
                            id="year"
                            name="year"
                            required={true}
                            defaultValue={book ? new Date(book.date).getFullYear() : ""}
                            />
                    </div>

                </div>
                <small id="dateHelper" className="form-text text-muted">Please enter the date that you finished reading the book</small>
                <br/>
                <div className="form-group">
                    <label htmlFor="review">Review</label>
                    <textarea className="form-control" name="review" id="review" rows={3} defaultValue={book ? book.review : ""}></textarea>
                </div>
                <br/>
                <div>
                    {bookError && <div className="alert alert-danger">{bookError}</div>}
                </div>
                <div className="container p-0">
                    <div className="row no-gutters">
                        {book ? 
                        <div className="col">
                            <button type="button" className="btn btn-danger" id="deleteEntry" onClick={deleteEntry}>Delete</button>
                        </div>
                        :  null }
                        <div className="col"></div>
                        <button type="button" className="btn btn-secondary mx-2" id={id + "-closeModal"} data-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary" style={{width: "7em"}}>{loading ?
                            <div className="spinner-border text-light" role="status" style={{width: "1.3em", height: "1.3em"}}>
                                <span className="visually-hidden" hidden={true}>Loading...</span>
                            </div>
                        : book ? "Save Edits" : "Add Entry"}</button>
                    </div>
                </div>
            </form>
        </div>
        </div>
        </div>
    </div>
    );
}

function parseBookForm(form: HTMLFormElement) {
    const formData = new FormData(form);
    const rating: number = parseInt(formData.get("rating") as string);
    const seriesNumber: number = parseFloat(formData.get("seriesNumber") as string);
    const month: number = parseInt(formData.get("month") as string);
    const day: number = parseInt(formData.get("day") as string);
    const year: number = parseInt(formData.get("year") as string);
    const date: Date = new Date(year, month - 1, day);
    console.log(date);
    console.log(date.toLocaleDateString());
    
    if (isNaN(date.getTime()) || day < 1 || day > 31 || year < 1900) {
        return {error: "Invalid date"};
    }
    if (rating < 0 || rating > 100) {
        return {error: "Invalid rating, must be between 0 and 100"};
    }
    if (formData.get("seriesNumber") != "" && isNaN(seriesNumber)) {
        return {error: "Invalid series number"};
    }

    const newBook = {
        title: formData.get("title") as string,
        author: formData.get("author") as string,
        series: formData.get("series") as string,
        seriesNumber: seriesNumber,
        rating: rating,
        genre: formData.get("genre") as string,
        month: month,
        day: day,
        year: year,
        review: formData.get("review") as string,
    };
    return newBook;
}

export default BookEntry;