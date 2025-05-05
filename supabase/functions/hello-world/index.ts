Deno.serve(async (req) => {
  console.log('Request received:', req.method, req.url)

  return new Response('Hello World!', {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })

  // if (req.method === HttpMethod.OPTIONS) {
  //   return new Response(null, {
  //     status: 204,
  //     headers: corsHeaders,
  //   })
  // }

  // try {
  //   if (req.method !== HttpMethod.POST) {
  //     return errorResponse(
  //       'Method not allowed',
  //       ErrorCode.METHOD_NOT_ALLOWED,
  //       StatusCode.METHOD_NOT_ALLOWED,
  //     )
  //   }

  //   // Parse the request body
  //   const body = await req.json().catch(() => ({}))
  //   const { name } = body

  //   // Validate input
  //   if (!name) {
  //     return errorResponse(
  //       'Name parameter is required',
  //       ErrorCode.BAD_REQUEST,
  //       StatusCode.BAD_REQUEST,
  //     )
  //   }

  //   // Return successful response with data
  //   return successResponse({
  //     message: `Hello ${name}!`,
  //   })
  // } catch (error) {
  //   console.error('Error processing request:', error)
  //   return errorResponse(
  //     'Error processing request',
  //     ErrorCode.INTERNAL_ERROR,
  //     StatusCode.INTERNAL_SERVER_ERROR,
  //   )
  // }
})
