"use strict";

// const express = require("express");
import express, {Request, Response, Application} from 'express';

const cors = require("cors");
const parser = require("body-parser");
const app:Application = express();
const routes = require("../routes/routes");
const sequelize = require("../config/config");

app.use(cors());
app.use(parser.urlencoded({extended:true}));
app.use(parser.json());

app.use(routes);

app.listen(4000, function(){
    console.log('Server is listening on port:4000');
});

module.exports = app;