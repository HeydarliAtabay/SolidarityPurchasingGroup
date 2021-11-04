"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const passportLocal = require("passport-local").Strategy; //Authentication strategy
const session = require("express-session"); //Session middleware
const passport = require("passport"); //Authentication middleware

// init express
const app = express();
const PORT = 3001;

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());