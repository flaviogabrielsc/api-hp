require('dotenv').config()
const { send } = require("express/lib/response");
const express = require("express");
const app = express();
const controllers = require('./routes/controllers.js') 
const database = require('./database/database.js') 

app.use(express.json()); 
const port = process.env.PORT || 3000 

app.use('/', controllers)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});