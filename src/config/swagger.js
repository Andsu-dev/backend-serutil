const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Technical Test Serutil API Documentation",
      version: "1.0.0",
      description: "API documentation for technical test at serUtil",
      contact: {
        name: "API Support",
        email: "support@serutil.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The task ID",
            },
            name: {
              type: "string",
              description: "The name of the task",
            },
            description: {
              type: "string",
              description: "The description of the task",
            },
            status: {
              type: "string",
              description: "The status of the task",
              enum: ["to do", "in progress", "done"],
            },
            start_date: {
              type: "integer",
              format: "int64",
              description:
                "The start date of the task (timestamp in milliseconds)",
              example: 1704067200000,
            },
            due_date: {
              type: "integer",
              format: "int64",
              description:
                "The due date of the task (timestamp in milliseconds)",
              example: 1704153600000,
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The error name",
            },
            message: {
              type: "string",
              description: "The error message",
            },
            statusCode: {
              type: "integer",
              description: "The HTTP status code",
            },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
