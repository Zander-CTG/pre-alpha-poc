import { corsHeaders } from '../_shared/response.ts'

Deno.serve(async (req) => {
  // Always add CORS headers
  const responseHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: responseHeaders,
    })
  }

  // Debug all incoming information from the request
  const debugInfo = {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  }

  console.log('Request debug info:', JSON.stringify(debugInfo, null, 2))

  // Try to get the body in multiple ways
  let bodyText = null
  let bodyJson = null

  try {
    // Clone the request to be able to read it multiple ways
    const reqClone = req.clone()

    // Try to read as text
    bodyText = await req.text()
    console.log('Raw body text:', bodyText)

    // Try to parse as JSON if there's content
    if (bodyText && bodyText.trim()) {
      try {
        bodyJson = JSON.parse(bodyText)
        console.log('Parsed JSON:', bodyJson)
      } catch (e) {
        console.error('Failed to parse JSON:', e)
      }
    } else {
      console.warn('Body text is empty or whitespace only')
    }
  } catch (e) {
    console.error('Error reading request body:', e)
  }

  // Return all the debug information
  return new Response(
    JSON.stringify({
      message: 'Debug information',
      request: debugInfo,
      bodyText: bodyText,
      bodyJson: bodyJson,
    }),
    {
      status: 200,
      headers: responseHeaders,
    },
  )
})
