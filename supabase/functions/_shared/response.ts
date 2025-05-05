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

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // https://www.fleavision.com, no localhost in prod
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
