async function checkImage(url: string) {
    try {
        // We use a 'HEAD' request to be fast and save bandwidth
        const response = await fetch(url, { method: 'HEAD' ,
            headers: {
                'Referer': 'https://localhost',
            }
        });
        return response.ok; 
    } catch (error) {
        // If there is hotlink protection or any other error, we consider the image invalid
        return false;
    }
}


// Searches google images and returns the URL of the first result of "title by author"
async function getCoverImageUrl(title: string, author: string): Promise<string> {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;
    const query = encodeURIComponent(`${title} by ${author}`);
    const res = await fetch(`https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}&searchType=image&num=10`)
    const data = await res.json();
    if (data.items && data.items.length > 0) {
        for (const item of data.items) {
            if (await checkImage(item.link)) {
                return item.link;
            }
        }
        return data.items[0].link;
    } else {
        return "";
    }
}

export default getCoverImageUrl;