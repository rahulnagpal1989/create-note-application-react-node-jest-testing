const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const app = express();
const routes = require("./routes/routes.js");
const sequelize = require("./config/config.js");

app.use(cors());
app.use(parser.urlencoded({extended:true}));
app.use(parser.json());

app.use(routes);

app.listen(4000, function(){
    console.log('Server is listening on port:4000');
});

module.exports = app;