export class BaseError  extends Error{
  public readonly action?: string;
  public readonly statusCode?: number;
  public readonly errorLocationCode?: string;
  public readonly key?: string;
  public readonly stack?: string | undefined;
  //public readonly message?: string;
  constructor(
    message?: string,
    stack?: any,
    action?: string,
    statusCode?: number,
    errorLocationCode?: string,
    key?: string,
  ) {
    super(message)
   // this.message = message;
    this.stack = stack;
    this.action = action;
    this.statusCode = statusCode;
    this.errorLocationCode = errorLocationCode;
    this.key = key;
  }
}
