import {
  corsHeaders,
  ErrorCode,
  errorResponse,
  StatusCode,
  successResponse,
} from '../_shared/response.ts'

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
    console.warn('Name is required')
    return errorResponse(
      'Name is required',
      ErrorCode.INTERNAL_ERROR,
      StatusCode.INTERNAL_SERVER_ERROR,
    )
  } else {
    return successResponse({ message: `Hello, ${name}!` })
  }
})
