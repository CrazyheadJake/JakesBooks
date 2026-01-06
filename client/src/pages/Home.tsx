import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/book';
import type { JSX } from 'react/jsx-runtime';
import BookCard from './BookCard';

function Home({ setError }: { setError: (x: string) => void }) {
    const [ bookError, setBookError ] = useState("");
    const [ books, setBooks ] = useState<Book[]>([]);
    const [ sortedBooks, setSortedBooks ] = useState<Book[]>([]);

    // Fetch books on component mount
    useEffect(() => {
        console.log("Fetching books");
        fetch('/api/getBooks')
            .then(res => res.json() as Promise<Book[]>)
            .then(data => setBooks(data));
    }, []);

    // Sort books by date whenever books change
    useEffect(() => {
        console.log("Books:", books);
        if (books.length > 0)
            setSortedBooks([...books].sort((a, b) => (new Date(b.date).getTime()) - (new Date(a.date).getTime())));
    }, [books]);

    return (
    <><h1 style={{textAlign: "center"}}>Book Log</h1>
    <div className="container-fluid" style={{textAlign: "center"}}>
        <div className="row">
            {sortedBooks.map((book, index) => (
                <BookCard book={book} key={index} />
            ))}
        </div>
    </div>
    <br/><br/>

    <div className="fixed-bottom">
        <div className="container-fluid bg-dark" style={{textAlign: "center"}}>
            <div className="row">
                <div className="col-5">
                    <form method="POST">
                        <div className="form-row">
                        <div className="form-group">
                            <select id="sorting" name="sorting" className="form-control-sm mr-1 my-1" required>
                            <option disabled hidden >Sort by...</option>
                            <option>Date</option>
                            <option>Rating</option>
                            <option>Author</option>
                            <option>Series</option>
                            <option>Title</option>
                            </select>

                        </div>
                        <div className="form-control-sm">
                        <button type="submit" className="btn btn-success btn-sm">Apply</button>
                        </div>
                        </div>
                    </form>
                </div>
                <div className="col-4" style={{textAlign: "left"}}>
                    <button type="button" className="btn btn-primary my-1 btn-sm" data-toggle="modal" data-target="#bookEntry">
                    New Entry
                    </button>
                </div>
                <div className="col-3" style={{textAlign: "right"}}>
                    <button type="button" className="btn btn-secondary my-1 btn-sm" data-toggle="modal" data-target="#singleLineEntry">
                    Line Entry
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div className="modal fade" id="bookEntry" tabIndex={-1} role="dialog">
    <div className="modal-dialog" role="document">
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title">New Book Entry</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div className="modal-body">
            <form onSubmit={(e) => addBook(e, setBookError, setBooks)}>
                <div className="form-group">
                    <label className="required-label" htmlFor="title required-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        placeholder="Enter title"
                        required={true}
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
                        />
                    </div>
                    <div className="form-group col-3">
                        <label htmlFor="seriesNumber">Number</label>
                        <input
                            type="number"
                            className="form-control"
                            id="seriesNumber"
                            name="seriesNumber"
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
                        />
                    </div>
                    <div className="form-group col">
                        <label className="required-label" htmlFor="genre">Genre</label>
                        <select id="genre" name="genre" className="form-control" required={true}>
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
                        <select id="month" name="month" className="form-control" itemType="number" required={true}>
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
                            />
                    </div>

                    <div className="form-group col">
                        <label className="required-label" htmlFor="year">Year</label>
                        <input type="number"
                            className="form-control"
                            id="year"
                            name="year"
                            required={true}
                            />
                    </div>

                </div>
                <small id="dateHelper" className="form-text text-muted">Please enter the date that you finished reading the book</small>
                <br/>
                <div className="form-group">
                    <label htmlFor="review">Review</label>
                    <textarea className="form-control" name="review" id="review" rows={3}></textarea>
                </div>
                <br/>
                <div>
                    {bookError && <div className="alert alert-danger">{bookError}</div>}
                </div>
                <div style={{textAlign: "right"}}>
                    <button type="button" className="btn btn-secondary" id="closeModal" data-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary">Add Entry</button>
                </div>
            </form>
            </div>
        </div>
        </div>
    </div>

    <div className="modal fade" id="singleLineEntry" tabIndex={-1} role="dialog">
    <div className="modal-dialog" role="document">
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title">New Book Entry</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div className="modal-body">
            <form method="POST">
                <div className="form-group">
                    <label className="required-label" htmlFor="lineEntries">Single Line Entries</label>
                    <textarea className="form-control" name="lineEntries" id="lineEntries" rows={12} required></textarea>
                    <small id="lineEntryHelper1" className="form-text text-muted">Please enter each entry on a single line in the form:</small>
                    <small id="lineEntryHelper2" className="form-text text-muted">Rating Title (Series name #number in series) by Author (Date Finished)</small>
                    <small id="lineEntryHelper3" className="form-text text-muted">Rating should be on a 0-100 scale. For example, some valid entries would be:</small>
                    <small id="lineEntryHelper4" className="form-text text-muted">92 The Well of Ascension (Mistborn #2) by Brandon Sanderson (2/23/21)</small>
                    <small id="lineEntryHelper5" className="form-text text-muted">95 The Original by Brandon Sanderson and Mary Robinette Kowal (3/16/21)</small>
                    <small id="lineEntryHelper6" className="form-text text-muted">88 To Sleep in A Sea of Stars by Christopher Paolini (10/4/20)</small>

                </div>
                <div style={{textAlign: "right"}}>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary">Add Entry</button>
                </div>
            </form>
        </div>
        </div>
    </div>
    </div>
    </>
    )
}

async function addBook(e: React.FormEvent<HTMLFormElement>, setError: (x: string) => void, setBooks: (x: Book[]) => void) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const rating: number = parseInt(formData.get("rating") as string);
    const seriesNumber: number = parseInt(formData.get("seriesNumber") as string);
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

    const res = await fetch("/api/addBook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book)
    });
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

export default Home;