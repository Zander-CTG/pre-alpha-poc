import {
  endpointHandler,
  ErrorCode,
  errorResponse,
  HttpMethod,
  StatusCode,
  successResponse,
} from '../_shared/response.ts'

const helloWorldHandler = endpointHandler({
  allowedMethods: [HttpMethod.POST],
  isRequestLogged: true,
  handler: async (req) => {
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
  },
})

Deno.serve(helloWorldHandler)
