const express = require("express");
const indexRouter = express.Router();
const messageController = require("../controllers/messageController");

indexRouter.get("/", messageController.getAllMessages);

module.exports = indexRouter;
