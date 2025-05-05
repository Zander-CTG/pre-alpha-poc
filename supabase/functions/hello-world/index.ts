import { StatusCode, corsHeaders } from '../_shared/response.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: StatusCode.NO_CONTENT,
      headers: corsHeaders,
    })
  }

  try {
    const body = await req.json()

    console.log('Request body:', body)

    const { name } = body || {}

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: StatusCode.BAD_REQUEST,
        headers: corsHeaders,
      })
    } else {
      return new Response(JSON.stringify({ message: `Hello, ${name}!` }), {
        status: StatusCode.OK,
        headers: corsHeaders,
      })
    }
  } catch (e) {
    console.error('Error:', e)
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: StatusCode.BAD_REQUEST,
      headers: corsHeaders,
    })
  }
})
