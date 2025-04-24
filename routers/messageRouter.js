const { Router } = require("express");
const messageRouter = Router();
const messageController = require("../controllers/messageController");

messageRouter.get("/new", messageController.newMessagePage);
messageRouter.post("/new", messageController.newMessage);
messageRouter.post("/delete/:id", messageController.deleteMessage);
module.exports = messageRouter;
