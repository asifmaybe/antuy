import server from "../dist/server/server.js";

export default async function handler(req, res) {
  // If Vercel provides a Web Request (detected by expected methods)
  if (req && typeof req.text === 'function' && typeof req.url === 'string' && typeof req.method === 'string') {
    try {
      return await server.fetch(req);
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message, stack: err.stack }), { status: 500 });
    }
  }

  // Fallback: Manually convert Node.js (req, res) to Web Request
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = new URL(req.url, `${protocol}://${host}`);

  const init = {
    method: req.method,
    headers: req.headers,
  };

  // Attach body for requests that are not GET or HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req;
    init.duplex = 'half'; // Essential for Node streams to Request bodies
  }

  const request = new Request(url, init);

  try {
    const response = await server.fetch(request);
    
    // Convert Web Response back to Node ServerResponse
    res.statusCode = response.status;
    res.statusMessage = response.statusText;
    
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (response.body) {
      // Stream the body chunks back to the client
      for await (const chunk of response.body) {
        res.write(chunk);
      }
    }
    res.end();
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: "Server Adapter Error", message: error.message, stack: error.stack }));
  }
}

