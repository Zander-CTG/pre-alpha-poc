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
    return errorResponse('Name is required', ErrorCode.BAD_REQUEST, StatusCode.BAD_REQUEST)
  } else {
    return successResponse<{ message: string }>({ message: `Hello, ${name}!` })
  }
})
