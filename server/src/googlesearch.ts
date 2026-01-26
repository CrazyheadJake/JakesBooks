// Searches google images and returns the URL of the first result of "title by author"
async function getCoverImageUrl(title: string, author: string): Promise<string> {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    const query = encodeURIComponent(`${title} by ${author}`);
    const res = await fetch(`https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}&searchType=image&num=1`)
    const data = await res.json();
    if (data.items && data.items.length > 0) {
        console.log("Image search result:", data.items[0].link);
        console.log("Image host site:", data.items[0].image.contextLink);
        console.log("Full data:", JSON.stringify(data, null, 2));
        return data.items[0].link;
    } else {
        return "";
    }
}

export default getCoverImageUrl;