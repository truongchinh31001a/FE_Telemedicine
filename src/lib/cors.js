// lib/cors.js
export function withCors(handler) {
  return async (req, ...args) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    const response = await handler(req, ...args);
    const headers = new Headers(response.headers);

    for (const [key, value] of Object.entries(corsHeaders)) {
      headers.set(key, value);
    }

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // ⚠️ hoặc chỉ định frontend của bạn
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
