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

interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: { message: string; code: ErrorCode } | null
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // https://www.fleavision.com, no localhost in prod
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apiKey',
  'Content-Type': 'application/json',
}

export function jsonResponse<T>(
  body: ApiResponse<T>,
  status: StatusCode,
  headers: HeadersInit = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      ...headers,
    },
  })
}

export function successResponse<T>(
  data: T,
  status: StatusCode = StatusCode.OK,
  headers: HeadersInit = {},
): Response {
  return jsonResponse({ success: true, data, error: null }, status, headers)
}

export function errorResponse(
  message: string,
  code: ErrorCode = ErrorCode.INTERNAL_ERROR,
  status: StatusCode = StatusCode.INTERNAL_SERVER_ERROR,
  headers: HeadersInit = {},
): Response {
  return jsonResponse({ success: false, data: null, error: { message, code } }, status, headers)
}
