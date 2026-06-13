import type { RequestHandler } from 'express';
import { sendError } from '../utils/apiResponse.js';

export const notFound: RequestHandler = (request, response) => {
  sendError(response, `Route ${request.method} ${request.originalUrl} not found`, 'NOT_FOUND', 404);
};
