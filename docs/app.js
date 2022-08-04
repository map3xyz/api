const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./map3-api.json');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log("Running docs server on localhost:3001");
app.listen(3001);
