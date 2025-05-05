import {
  corsHeaders,
  ErrorCode,
  errorResponse,
  HttpMethod,
  StatusCode,
  successResponse,
} from '../_shared/response.ts'

Deno.serve(async (req) => {
  console.log('Request:', req.method, req.body)

  if (req.method === HttpMethod.OPTIONS) {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== HttpMethod.POST) {
      return errorResponse(
        'Method not allowed',
        ErrorCode.METHOD_NOT_ALLOWED,
        StatusCode.METHOD_NOT_ALLOWED,
      )
    }

    // Parse the request body
    const body = await req.json().catch(() => ({}))
    const { name } = body

    // Validate input
    if (!name) {
      return errorResponse(
        'Name parameter is required',
        ErrorCode.BAD_REQUEST,
        StatusCode.BAD_REQUEST,
      )
    }

    // Return successful response with data
    return successResponse({
      message: `Hello ${name}!`,
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return errorResponse(
      'Error processing request',
      ErrorCode.INTERNAL_ERROR,
      StatusCode.INTERNAL_SERVER_ERROR,
    )
  }
})
