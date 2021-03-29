import { HttpException, HttpStatus } from '@nestjs/common';
import { BusiErrorCode } from '../enums/error-code-enum';

export class BusiException extends HttpException {
  private _code: BusiErrorCode;
  private _message: string;
  constructor(
    code: BusiErrorCode | number,
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(message, statusCode);
    this._code = code;
    this._message = message;
  }

  getErrorCode(): BusiErrorCode {
    return this._code;
  }

  getErrorMessage(): string {
    return this._message;
  }
}
