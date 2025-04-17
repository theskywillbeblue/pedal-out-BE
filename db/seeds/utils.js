const db = require("../../db/connection");
const format = require("pg-format");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

exports.checkExists = (table, column, value) => {
  const queryStr = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Resource not found" });
    }
  });
};

exports.capitaliseFirstLetter = (str) => {
  const firstLetter = str[0];
  const otherLetters = str.toLowerCase().slice(1);
  return firstLetter.toUpperCase() + otherLetters;
};

exports.checkUser = (username) => {
  return supabase
  .from('user_profile')
  .select('username')
  .eq('username', username)
  .then((result) => {
        if (result.error) {
          throw new Error("Supabase connection error: " + result.error.message);
        }
  
        if (!result.data || result.data.length === 0) {
          return Promise.reject({ status: 400, msg: "Invalid input." });
        }
  
        return result.data;
      })
      .catch((err) => {
        return Promise.reject({ status: 400, msg: "Invalid input." });
  });
};
