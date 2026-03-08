const pool = require("../config/db");

const createUser = async (first_name, last_name, email, password_hash) => {

  const result = await pool.query(
    `INSERT INTO customers (first_name, last_name, email, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [first_name, last_name, email, password_hash]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {

  const result = await pool.query(
    `SELECT * FROM customers WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};