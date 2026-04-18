const { Request, Response } = require('undici');
const http = require('http');

const server = {
  fetch: async (req) => {
    console.log("Fetch received:", req.method, req.url);
    return new Response("Hello World from Web Response", { status: 200 });
  }
};

const handler = async (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const url = new URL(req.url, `${protocol}://${host}`);

  const init = {
    method: req.method,
    headers: req.headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req;
    init.duplex = 'half';
  }

  const request = new Request(url, init);

  try {
    const response = await server.fetch(request);
    
    res.statusCode = response.status;
    res.statusMessage = response.statusText;
    
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    if (response.body) {
         for await (const chunk of response.body) {
           res.write(chunk);
         }
    }
    res.end();
  } catch (error) {
    res.statusCode = 500;
    res.end(error.stack);
  }
};

const srv = http.createServer(handler);
srv.listen(3002, () => {
  console.log("Server listening");
  http.get("http://localhost:3002/", (res) => {
     let data = "";
     res.on('data', c => data += c);
     res.on('end', () => {
        console.log("Response:", res.statusCode, data);
        srv.close();
     });
  });
});
