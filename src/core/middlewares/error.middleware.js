const BaseError = require("../errors/base.error");
const { ClickUpApiError } = require("../errors/repository.error");

function errorHandler(err, req, res, next) {
  // If it's an Axios error (ClickUp API)
  if (err.isAxiosError) {
    const { response, request } = err;

    if (response) {
      const { err: errorMessage, ECODE: errorCode } = response.data || {};
      const clickUpError = new ClickUpApiError(
        errorMessage || "ClickUp API error",
        response.status,
        errorCode
      );
      return res.status(clickUpError.statusCode).json(clickUpError.toJSON());
    }

    if (request) {
      const clickUpError = new ClickUpApiError(
        "No response from ClickUp API",
        503
      );
      return res.status(clickUpError.statusCode).json(clickUpError.toJSON());
    }

    const clickUpError = new ClickUpApiError(
      "Error making request to ClickUp API",
      500
    );
    return res.status(clickUpError.statusCode).json(clickUpError.toJSON());
  }

  // If it's a known error (our BaseError class)
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // If it's an Express validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      name: "ValidationError",
      message: err.message,
      statusCode: 400,
    });
  }

  // For unknown errors
  console.error("Unexpected error:", err);
  return res.status(500).json({
    name: "InternalServerError",
    message: "An unexpected error occurred",
    statusCode: 500,
  });
}

module.exports = errorHandler;
