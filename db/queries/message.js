const pool = require("../pool");
exports.getAllmessages = async (req, res) => {
  const messages = await pool.query(`
        SELECT messages.*, users.first_name, users.last_name
        FROM messages
        JOIN users ON messages.user_id = users.id
        ORDER BY messages.timestamp DESC
      `);
  return messages;
};

exports.insertMessage = async (title, text, userId) => {
  await pool.query(
    "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)",
    [title, text, userId]
  );
};

exports.deleteMessage = async (id) => {
  await pool.query(`DELETE FROM messages WHERE id = $1`, [id]);
};
