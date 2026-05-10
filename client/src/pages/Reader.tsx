import Epub, { Book } from "epubjs";
import { useEffect, useRef, useState } from "react";
import { get, set } from 'idb-keyval';

function Reader() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const viewerRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<Book>(null); // Use proper types if available

    useEffect(() => {
        if (!selectedFile || !viewerRef.current) return;
        
        set('current-book', selectedFile); // Cache the selected book in IndexedDB

        // 1. Convert File to ArrayBuffer
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            
            if (bookRef.current) {
                bookRef.current.destroy();
            }

            // 2. Open as "binary" to prevent Vite path resolution errors
            const book = Epub(arrayBuffer);
            book.navigation
            bookRef.current = book;

            const rendition = book.renderTo(viewerRef.current!, {
                width: "100%",
                height: "100vh",
                flow: "paginated",
                manager: "default"
            });

            // Listen for key events inside the EPUB iframe
            rendition.on("keydown", (event: KeyboardEvent) => {
                if (event.key === "ArrowRight") {
                    rendition.next();
                }
                if (event.key === "ArrowLeft") {
                    rendition.prev();
                }
            });

            // When the user turns the page, save the new location
            rendition.on("relocated", async (location: any) => {
                await set('last-location', location.start.cfi);
            });

            const lastLocation = await get('last-location');

            try {
                await rendition.display(lastLocation || undefined); // Try to restore last location
            } catch (err) {
                console.error("Error displaying book:", err);
            }
        };

        reader.readAsArrayBuffer(selectedFile);
        
        // Not sure if this destructor is actually necessary
        return () => {
            if (bookRef.current) {
                bookRef.current.destroy();
            }
        };
    }, [selectedFile]);

    useEffect(() => {
        // Check for cached book on first mount
        get('current-book').then((cachedBook) => {
            if (cachedBook) setSelectedFile(cachedBook);
        });

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    function nextPage() {
        console.log("Next page clicked");
        if (bookRef.current) {
            bookRef.current.rendition.next();
        }
    }
    function prevPage() {
        console.log("Previous page clicked");
        if (bookRef.current) {
            bookRef.current.rendition.prev();
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "ArrowRight") {
            nextPage();
        }
        if (e.key === "ArrowLeft") {
            prevPage();
        }
    }

    return (
        <>
            <h1 style={{textAlign: "center"}}>Reader</h1>
            <div className="custom-file">
                <input 
                    type="file" 
                    accept=".epub"
                    className="custom-file-input" 
                    id="fileInput" 
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
                <label className="custom-file-label" htmlFor="fileInput">
                    {selectedFile ? selectedFile.name : "Upload Book"}
                </label>
            </div>
            {/* Use a ref instead of an ID string for more reliable React rendering */}
            <div ref={viewerRef} style={{marginTop: "20px", border: "1px solid #ccc"}} onKeyDown={nextPage}></div>
        </>
    );
}

export default Reader;