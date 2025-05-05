import {
  ErrorCode,
  errorResponse,
  logRequestInfo,
  optionsResponse,
  StatusCode,
  successResponse,
} from '../_shared/response.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return optionsResponse()
  }

  if (req.method !== 'POST') {
    return errorResponse(
      'Method not allowed',
      ErrorCode.METHOD_NOT_ALLOWED,
      StatusCode.METHOD_NOT_ALLOWED,
    )
  }

  logRequestInfo(req)

  const body = await req.json()
  const { name } = body || {}

  if (!name) {
    return errorResponse(
      'Name is required',
      ErrorCode.INTERNAL_ERROR,
      StatusCode.INTERNAL_SERVER_ERROR,
    )
  } else {
    return successResponse({ message: `Hello, ${name}!` })
  }
})
