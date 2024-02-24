const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["src/server.js"]; // Path to your Express application file

const swaggerDefinition = require("./swaggerDef"); // Path to your Swagger definition file

swaggerAutogen(outputFile, endpointsFiles, swaggerDefinition);
