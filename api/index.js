import server from "../dist/server/server.js";

export default async function handler(request) {
  try {
    return await server.fetch(request);
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "API Handler Error", 
      message: error.message,
      stack: error.stack 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
