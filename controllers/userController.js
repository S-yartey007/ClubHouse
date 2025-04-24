const queries = require("../db/queries/user");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "../.env" });
exports.signUpPost = async (req, res) => {
  const { first_name, last_name, email, password, confirmPassword, is_admin } =
    req.body;

  const isAdmin = is_admin === process.env.ADMIN_CODE ? true : false;
  try {
    // Basic validation
    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      return res.redirect("/users/signup");
    }

    if (password !== confirmPassword) {
      return res.redirect("/users/signup");
    }

    // Check if user already exists
    const rows = await queries.searchUser(email);
    if (rows.length > 0) {
      res.send("<h2>User already exists</h2>");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB

    await queries.insertUser(
      first_name,
      last_name,
      email,
      hashedPassword,
      (membership_status = false),
      isAdmin
    );
    res.redirect("/users/login");
  } catch (err) {
    console.error("Error signing up:", err);
    res.redirect("/users/signup");
  }
};

exports.signUpGet = async (req, res) => {
  res.render("sign-up");
};

exports.loginGet = async (req, res) => {
  res.render("login");
};

exports.memberJoin = async (req, res) => {
  res.render("join");
};

exports.addMembers = async (req, res) => {
  const { code } = req.body;
  if (code === process.env.MEMBERSHIP_CODE) {
    await queries.addMembers(req.user.id);
    res.redirect("/");
  } else {
    res.send("<h1>Enter correct code</h1>");
  }
};

exports.loginError = async (req, res) => {
  res.render("error", { title: "Login Error: User does not exist" });
};
