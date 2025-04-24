const queries = require("../db/queries/message");

exports.getAllMessages = async (req, res) => {
  const { rows } = await queries.getAllmessages();
  res.render("index", {
    messages: rows,
  });
};

exports.newMessage = async (req, res) => {
  const { title, text } = req.body;
  await queries.insertMessage(title, text, req.user.id);
  res.redirect("/");
};

exports.newMessagePage = async (req, res) => {
  res.render("create-message");
};

exports.deleteMessage = async (req, res) => {
  const id = req.params.id;
  await queries.deleteMessage(id);
  res.redirect("/");
};
