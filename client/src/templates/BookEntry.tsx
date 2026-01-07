import { useEffect, useState } from "react";
import type { Book } from "../types/book";

function BookEntry({ book, setBooks, setBook, id}: { book: Book | null, setBooks: (x: Book[]) => void, setBook: (x: Book | null) => void, id: string }) {
    const [ bookError, setBookError ] = useState("");

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
            <form onSubmit={(e) => addBook(e, setBookError, setBooks, book)}>
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
                        <select id="genre" name="genre" className="form-control" required={true} defaultValue={book ? book.genre : "Sci-fi"}>
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
                        <select id="month" name="month" className="form-control" itemType="number" required={true} defaultValue={book ? (new Date(book.date).getMonth() + 1) : ""}>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
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
                <div style={{textAlign: "right"}}>
                    <button type="button" className="btn btn-secondary" id="closeModal" data-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary">{book ? "Save Edits" : "Add Entry"}</button>
                </div>
            </form>
            </div>
        </div>
        </div>
    </div>
    );
}

async function addBook(e: React.FormEvent<HTMLFormElement>, setError: (x: string) => void, setBooks: (x: Book[]) => void, currentBook: Book | null) {
    e.preventDefault();
    const form = e.currentTarget;
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
        setError("Invalid date");
        return;
    }
    if (rating < 0 || rating > 100) {
        setError("Invalid rating, must be between 0 and 100");
        return;
    }
    if (formData.get("seriesNumber") != "" && isNaN(seriesNumber)) {
        setError("Invalid series number");
        return;
    }

    const book = {
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
    let res;
    if (currentBook && currentBook._id) {
        res = await fetch("/api/updateBook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookId: currentBook._id, ...book })
        });
    }
    else {
        res = await fetch("/api/addBook", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book)
        });
    }
    console.log(res);
    if (res.ok) {
        form.reset();
        const modalClose = document.getElementById("closeModal");
        modalClose?.click();

        fetch('/api/getBooks')
            .then(res => res.json() as Promise<Book[]>)
            .then(data => setBooks(data));
    }
    else {
        const body = await res.json();
        setError(body.error);
    }
    

}

export default BookEntry;