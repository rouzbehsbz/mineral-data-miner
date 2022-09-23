class HttpResponse {
  public status: number;
  public error: boolean = false;
  public message!: string;
  public result: any;
  public currentPage!: number;
  public totalPages!: number;

  constructor(options: {
    status?: number;
    message?: string;
    container?: any;
    currentPage?: number;
    totalPages?: number;
  }) {
    this.status = options.status ? options.status : 200;

    if (!(options.message === null || options.message === undefined)) {
      this.message = options.message;
    }
    if (!(options.container === null || options.container === undefined)) {
      this.result = options.container;
    }
    if (options.currentPage) {
      this.currentPage = options.currentPage;
    }
    if (options.totalPages) {
      this.totalPages = options.totalPages;
    }
  }

  public toJSON() {
    return {
      error: this.error,
      ...(this.message && {
        message: this.message,
      }),
      ...(this.result && {
        result: this.result,
      }),
      ...(this.currentPage && {
        currentPage: this.currentPage,
      }),
      ...(this.totalPages && {
        totalPages: this.totalPages,
      }),
    };
  }

  public getStatus() {
    return this.status;
  }
}

export default HttpResponse;
