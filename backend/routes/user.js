const express = require("express");
const { loginUser, signupUser } = require("../controllers/user");
const requireAuth = require("../middlewares/requireUserAuth");


const userRouter = express.Router();

userRouter.post("/login", loginUser);

userRouter.post("/signup", signupUser);

module.exports = userRouter