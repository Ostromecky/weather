import {HttpsError} from 'firebase-functions/v2/https';

export class NotFoundError extends HttpsError {
  constructor(message: string, code = 404) {
    super('not-found', message, {code});
  }
}
