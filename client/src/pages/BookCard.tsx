function BookCard({ book }: { book: any }) {
    return  (
        <div className="card border-info mr-3 mb-3" style={{width: "14rem"}}>
            <img className="card-img-top" src={book.cover} alt="Book Cover" onError={missingCover}/>

            <div className="card-body p-2" style={{textAlign: "center"}}>
                <h5 className="card-title mb-1">{ book.title }</h5>
                {book.series !== "" ? 
                <>
                <h5 className="card-subtitle mb-1 text-muted">by { book.author }</h5>
                <h6 className="card-subtitle mb-2 text-muted">({ book.series + " #" + book.seriesNumber})</h6>
                </>: 
                <>
                <h5 className="card-subtitle mb-2 text-muted">by { book.author }</h5>
                </>
                }
                <h5 className="card-subtitle mb-2 text-muted">{ book.date }</h5>

                { book.review ?
                <>
                <p className="card-text" style={{textAlign: "left"}}>{ book.review }...</p>
                </> : <></>}
                <div className="progress">
                    <div className="progress-bar" style={{width: book.rating}} role="progressbar">{ book.rating }/100</div>
                </div>

                { book.review ? 
                <>
                <button type="button" className="btn btn-info mt-3" data-toggle="modal" data-target="#editEntry{{entry.id}}">Edit</button>
                <button type="button" className="btn btn-info mt-3" data-toggle="modal" data-target="#{{entry.id}}">Read Full Review</button>
                </> : 
                <>
                <button type="button" className="btn btn-info mt-3" data-toggle="modal" data-target="#editEntry{{entry.id}}">Edit</button>
                </>}
            </div>
        </div>
    )
}

function missingCover(e: React.SyntheticEvent<HTMLImageElement>) {
    const book = e.currentTarget;
    book.src = "assets/react.svg";
}

export default BookCard;