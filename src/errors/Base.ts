export class BaseError extends Error {
  public action: string;
  public statusCode: number;
  public errorLocationCode?: string;
  public key?: string;
  public stack?: string | undefined;
  constructor(
    message: string,
    stack: any,
    action: string,
    statusCode: number,
    errorLocationCode?: string,
    key?: string,
  ) {
    super();
    this.message = message;
    this.stack = stack;
    this.action = action;
    this.statusCode = statusCode;
    this.errorLocationCode = errorLocationCode;
    this.key = key;
  }
}
