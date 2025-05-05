import { corsHeaders, StatusCode, successResponse } from '../_shared/response.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: StatusCode.NO_CONTENT,
      headers: corsHeaders,
    })
  }

  const body = await req.json()

  console.log('Request body:', body)

  const { name } = body || {}

  if (!name) {
    // return errorResponse('Name is required', ErrorCode.BAD_REQUEST, StatusCode.BAD_REQUEST)
    throw new Error('Name is required')
  } else {
    return successResponse({ message: `Hello, ${name}!` })
  }
})
