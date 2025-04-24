const pool = require("../pool");

exports.insertUser = async (
  first_name,
  last_name,
  email,
  hashedPassword,
  membership_status,
  is_admin
) => {
  await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, membership_status, is_admin)
         VALUES ($1, $2, $3, $4, $5, $6)`,
    [first_name, last_name, email, hashedPassword, membership_status, is_admin]
  );
};

exports.searchUser = async (email) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  return rows;
};

exports.addMembers = async (id) => {
  await pool.query("UPDATE users SET membership_status = true WHERE id = $1", [
    id,
  ]);
};
