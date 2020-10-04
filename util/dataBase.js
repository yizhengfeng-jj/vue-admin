const mysql = require("mysql");

// 创造链接对象
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "742981515",
  port: 3306,
  database: "myblog",
});

// 链接
con.connect();

const exec = (sql, data) => {
  return new Promise((resolve, reject) => {
    con.query(sql, data, (error, result) => {
        console.log(sql, 'aaa');
      if (error) {
        reject(error);
      }

      resolve(result);
    });
  });
};

const query = con.query;

module.exports = {
  exec,
  query,
};
