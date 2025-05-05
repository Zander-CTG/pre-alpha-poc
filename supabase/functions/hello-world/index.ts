import {
  corsPreflight,
  ErrorCode,
  errorResponse,
  StatusCode,
  successResponse,
} from '../_shared/response.ts'

Deno.serve(async (req) => {
  await corsPreflight(req.method)

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
