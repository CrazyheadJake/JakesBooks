export default function middleware(request: Request) {
  const url = new URL(request.url);

  // Check if the request is going to /api
  if (url.pathname.startsWith('/api')) {
    // Get your backend URL from Vercel Environment Variables
    const backendUrl = process.env.API_URL!;

    // Construct the new destination URL
    // This takes the path after /api and appends it to your backend URL
    const targetPath = url.pathname.replace(/^\/api/, '');
    const targetUrl = new URL(targetPath + url.search, backendUrl);

    // Perform the rewrite
    return fetch(targetUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      // @ts-ignore - duplex is required for streaming bodies in some environments
      duplex: 'half',
    });
  }
}

// Ensure Vercel only runs this for API routes
export const config = {
  matcher: '/api/:path*',
};