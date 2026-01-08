import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/book';
import type { JSX } from 'react/jsx-runtime';
import BookCard from '../templates/BookCard';
import BookEntry from '../templates/BookEntry';

function Home({ setError }: { setError: (x: string) => void }) {
    const [ books, setBooks ] = useState<Book[]>([]);
    const [ sortedBooks, setSortedBooks ] = useState<Book[]>([]);
    const [ selectedBook, setSelectedBook ] = useState<Book | null>(null);
    const [ sortingMethod, setSortingMethodState ] = useState<string>(localStorage.getItem('sortingMethod') || 'date');
    const [ message, setMessage ] = useState<string>("");
    // Close initial message on mount
    useEffect(() => {
        document.getElementById("closeAlert")?.click();
    }, []);

    // Add alert to DOM on message change
    useEffect(() => addAlert(message, setMessage), [message]);

    // Fetch books on component mount
    useEffect(() => {
        console.log("Fetching books");
        fetch('/api/getBooks')
            .then(res => res.json() as Promise<Book[]>)
            .then(data => setBooks(data));
    }, []);

    // Sort books by date whenever books change
    useEffect(() => setSortedBooks(sortBooks(books, sortingMethod)), [books, sortingMethod]);

    return (
    <>
    <div id="alertPlaceholder">
    </div>
    <h1 style={{textAlign: "center"}}>Book Log</h1>
    <div className="container-fluid">
        <div className="row justify-content-center">
            {sortedBooks.map((book, index) => (
                <BookCard book={book} key={index} setSelectedBook={setSelectedBook} />
            ))}
        </div>
    </div>
    <br/><br/>

    <div className="fixed-bottom">
        <div className="container-fluid bg-dark" style={{textAlign: "center"}}>
            <div className="row no-gutters">
                <div className="col">
                    <form onSubmit={(e) => setSortingMethod(e, setSortingMethodState)}>
                        <div className="form-row">
                        <div className="form-group">
                            <select id="sorting" name="sorting" className="form-control-sm mr-1 my-1" defaultValue={sortingMethod} required>
                            <option disabled hidden >Sort by...</option>
                            <option value="date">Date</option>
                            <option value="rating">Rating</option>
                            <option value="author">Author</option>
                            <option value="series">Series</option>
                            <option value="title">Title</option>
                            </select>

                        </div>
                        <div className="form-control-sm">
                        <button type="submit" className="btn btn-success btn-sm">Apply</button>
                        </div>
                        </div>
                    </form>
                </div>
                <div className="col" style={{textAlign: "center"}}>
                    <button type="button" className="btn btn-primary my-1 mr-3 btn-sm" data-toggle="modal" data-target="#newBookEntry" onClick={() => setSelectedBook(null)}>
                    New Entry
                    </button>
                </div>
                <div className="col" style={{textAlign: "right"}}>
                    <button type="button" className="btn btn-secondary my-1 btn-sm" data-toggle="modal" data-target="#singleLineEntry" onClick={() => setMessage("Test")}>
                    Line Entry
                    </button>
                </div>
            </div>
        </div>
    </div>

    <BookEntry setBooks={setBooks} book={selectedBook} setMessage={setMessage} id="newBookEntry" />
    <BookEntry setBooks={setBooks} book={selectedBook} setMessage={setMessage} id="editBookEntry" />

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

    <div className="modal fade" id="readReview" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-body" style={{textAlign: "left"}}>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h5 className="modal-title mb-1">{ selectedBook?.title}</h5>
                    {selectedBook?.series !== "" ? <>
                    <h5 className="modal-subtitle mb-1 text-muted">by { selectedBook?.author }</h5>
                    <h6 className="modal-subtitle mb-3 text-muted">({ selectedBook?.series + " #"}{ selectedBook?.seriesNumber })</h6>
                    </>:<>
                    <h5 className="modal-subtitle mb-3 text-muted">by { selectedBook?.author }</h5>
                    </>}
                    <br/>
                    {selectedBook?.review}

                </div>

            </div>
          </div>
        </div>
    </>
    )
}

function addAlert(message: string, setMessage: (x: string) => void) {
    // Close previous alert if it exists
    document.getElementById("closeAlert")?.click();
    if (message === "") return;

    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-success alert-dismissable fade show";
    alertDiv.innerHTML = `${message}
    <button type="button" class="close" id="closeAlert" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>`;
    alertDiv.onclick = () => setMessage("");
    document.getElementById("alertPlaceholder")?.appendChild(alertDiv);
}

async function setSortingMethod(e: React.FormEvent<HTMLFormElement>, setSortingMethodState: (x: string) => void) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const sortingMethod = formData.get("sorting") as string;
    localStorage.setItem("sortingMethod", sortingMethod);
    setSortingMethodState(sortingMethod);
}

function sortBooks(books: Book[], sortingMethod: string): Book[] {
    console.log("Books:", books);
    if (books.length > 0) {
        let sortedBooks = [...books];
        switch (sortingMethod) {
            case "date":
                sortedBooks.sort((a, b) => (new Date(b.date).getTime()) - (new Date(a.date).getTime()));
                break;
            case "rating":
                sortedBooks.sort((a, b) => {
                    if (b.rating === a.rating) {
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                    }
                    return b.rating - a.rating;
                });
                break;
            case "author":
                sortedBooks.sort((a, b) => {
                    if (a.author === b.author) {
                        return a.title.localeCompare(b.title);
                    }
                    return a.author.localeCompare(b.author);
                });
                break;
            case "series":
                sortedBooks.sort((a, b) => {
                    if (!a.series) {
                        if (!b.series) {
                            return a.title.localeCompare(b.title);
                        }
                        return 1;
                    }
                    if (!b.series) {
                        return -1;
                    }
                    if (a.series === b.series) {
                        return a.seriesNumber! - b.seriesNumber!;
                    }
                    return a.series.localeCompare(b.series);
                });
                break;
            case "title":
                sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }
        return sortedBooks;
    }
    return [];
}

export default Home;