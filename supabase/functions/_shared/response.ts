export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
}

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorCode {
  MISSING_AUTH = 'Missing auth',
  INVALID_TOKEN = 'Invalid token',
  UNAUTHORIZED = 'Unauthorized',
  BAD_REQUEST = 'Bad request',
  METHOD_NOT_ALLOWED = 'Method not allowed',
  INTERNAL_ERROR = 'Internal error',
  NOT_FOUND = 'Not found',
  CONFLICT = 'Conflict',
  FORBIDDEN = 'Forbidden',
}

/*
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'https://www.fleavision.com'
];

// Only set Access-Control-Allow-Origin if origin is allowed
if (origin && allowedOrigins.includes(origin)) {
  headers['Access-Control-Allow-Origin'] = origin;
}
// If origin is not in allowed list, don't include the header at all
// (which will cause browsers to block the response)
*/

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // https://www.fleavision.com, http://localhost:5173, no localhost in prod
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'content-type, authorization, x-client-info, apikey',
}

export function optionsResponse(): Response {
  return new Response('ok', { headers: corsHeaders })
}

export function successResponse<T>(
  data: T,
  status: StatusCode = StatusCode.OK,
  isLogged: boolean = false,
): Response {
  if (isLogged) {
    console.log('SUCCESS:', { data, status })
  }
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

export function errorResponse(
  message: string,
  code: ErrorCode = ErrorCode.INTERNAL_ERROR,
  status: StatusCode = StatusCode.INTERNAL_SERVER_ERROR,
  isLogged: boolean = true,
): Response {
  if (isLogged) {
    console.error('ERROR:', { message, code, status })
  }
  return new Response(JSON.stringify(message), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

export function logRequestInfo(req: Request): void {
  const origin = req.headers.get('Origin') || req.headers.get('Referer') || 'unknown'
  const userAgent = req.headers.get('User-Agent') || 'unknown'

  console.log('Request:', {
    origin,
    userAgent,
  })
}

type EndpointHandlerConfig = {
  allowedMethods: HttpMethod[]
  isRequestLogged: boolean
  handler: (req: Request) => Promise<Response>
}

export const endpointHandler = ({
  allowedMethods,
  isRequestLogged,
  handler,
}: EndpointHandlerConfig) => {
  return async (req: Request): Promise<Response> => {
    try {
      if (req.method === 'OPTIONS') {
        return optionsResponse()
      }

      if (isRequestLogged) {
        logRequestInfo(req)
      }

      if (!allowedMethods.includes(req.method as HttpMethod)) {
        return errorResponse(
          'HTTP method not allowed',
          ErrorCode.METHOD_NOT_ALLOWED,
          StatusCode.METHOD_NOT_ALLOWED,
        )
      }

      return await handler(req)
    } catch (error) {
      console.error('ERROR:', error)
      return errorResponse(
        'Edge function error',
        ErrorCode.INTERNAL_ERROR,
        StatusCode.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
