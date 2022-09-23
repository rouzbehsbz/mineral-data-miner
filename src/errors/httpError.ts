class HttpError extends Error {
  public errorMessage: string;
  public errorStatusCode: number;

  constructor(message: string, statusCode?: number) {
    super();

    this.errorMessage = message;
    this.errorStatusCode = statusCode || 400;
  }

  getStatus() {
    return this.errorStatusCode;
  }

  toJSON() {
    return {
      error: true,
      message: this.errorMessage,
    };
  }
}

export default HttpError;
