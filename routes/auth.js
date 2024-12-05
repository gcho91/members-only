const express = require("express");
// const passport = require("passport");
// const bcrypt = require("bcryptjs");
// const { pool } = require("../config/db");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
const { ensureMembership } = require("../middleware/checkAuth");

const router = express.Router();

// Routes
router.get("/", authController.getIndex);
router.get("/sign-up", authController.getSignUp);
router.post("/sign-up", authController.signUp);
router.get("/log-in", authController.getLogin);
router.post("/log-in", authController.login);
router.get("/log-out", authController.logout);

router.get("/join", ensureMembership, userController.getJoin);
router.post("/join", userController.postJoin);

router.get("/message/new", messageController.getNewMessage);
router.post("/message/new", messageController.postNewMessage);

module.exports = router;

//@todo: when user is logged in already, user should not be able to make a new account
// if logged in and user makes account, ?
