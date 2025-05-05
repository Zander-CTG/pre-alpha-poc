import {
  corsHeaders,
  ErrorCode,
  errorResponse,
  HttpMethod,
  StatusCode,
  successResponse,
} from '../_shared/response.ts'

Deno.serve(async (req) => {
  console.log('Request:', req.method)
  console.log('Content-Type:', req.headers.get('Content-Type'))
  console.log('Content-Length:', req.headers.get('Content-Length'))

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

    // Check if request has a body before attempting to parse
    const contentLength = req.headers.get('Content-Length')
    if (!contentLength || parseInt(contentLength) === 0) {
      console.warn('Empty request body received')
      return errorResponse('Empty request body', ErrorCode.BAD_REQUEST, StatusCode.BAD_REQUEST)
    }

    try {
      const bodyText = await req.text()
      console.log('Raw request body text:', bodyText)

      // Guard against empty body
      if (!bodyText) {
        return errorResponse('Empty request body', ErrorCode.BAD_REQUEST, StatusCode.BAD_REQUEST)
      }

      // Parse the JSON manually
      const body = JSON.parse(bodyText)
      console.log('Parsed request body:', body)

      const { name } = body || {}

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
    } catch (jsonError) {
      console.error('Error parsing JSON:', jsonError)
      return errorResponse(
        `Invalid JSON: ${jsonError.message}`,
        ErrorCode.BAD_REQUEST,
        StatusCode.BAD_REQUEST,
      )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return errorResponse(
      'Error processing request',
      ErrorCode.INTERNAL_ERROR,
      StatusCode.INTERNAL_SERVER_ERROR,
    )
  }
})
