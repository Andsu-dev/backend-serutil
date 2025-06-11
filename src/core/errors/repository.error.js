const BaseError = require("./base.error");

class RepositoryError extends BaseError {
  constructor(message) {
    super(message, 500);
  }
}

class DocumentNotFoundError extends BaseError {
  constructor(id) {
    super(`Document with id ${id} not found`, 404);
  }
}

class BadRequestError extends BaseError {
  constructor(message) {
    super(message, 400);
  }
}

class DuplicateKeyError extends BaseError {
  constructor(message) {
    super(message, 409);
  }
}

class NotFoundError extends BaseError {
  constructor(message) {
    super(message, 404);
  }
}

class ClickUpApiError extends BaseError {
  constructor(message, statusCode = 500, errorCode = null) {
    super(message, statusCode);
    this.errorCode = errorCode;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
    };
  }
}

module.exports = {
  RepositoryError,
  DocumentNotFoundError,
  DuplicateKeyError,
  NotFoundError,
  BadRequestError,
  ClickUpApiError,
};
