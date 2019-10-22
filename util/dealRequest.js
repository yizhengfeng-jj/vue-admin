const { exec } = require("./dataBase");
const moment = require("moment");
const addSecurit = require("./crypto");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const formidable = require("formidable");
const getList = (req, res) => {
  return new Promise((resole, reject) => {
    const { body } = req || {};
    let { author, keyword } = body || {};

    let sql = `select * from blog where 1=1 `;

    if (author) {
      sql += `and author='${author}' `;
    }

    if (keyword) {
      sql += `and title like '%${keyword}%' `;
    }

    sql += `order by createTime`;

    exec(sql).then(result => {
      // 对result的tags做处理
      const res = result.map(item => {
        item.tags =
          typeof (item && item.tags) === "string" ? item.tags.split(",") : [];

        return item;
      });

      resole(res);
    });
  });
};

const getSimpleBlog = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { id } = body;

    const sql = `select * from blog where id=${id}`;

    if (!id) {
      reject("id 是必须的");

      return;
    }

    exec(sql).then(result => {
      if (result && result[0] && result[0].tags) {
        const { tags } = result[0];

        result[0].tags = typeof tags === "string" ? tags.split(",") : [];
      }

      resolve(result);
    });
  });
};

const deleteSimple = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { id } = body || {};

    if (!id) {
      reject("id 是必须得");

      return;
    }

    const sql = `delete from blog where id=${id}`;

    exec(sql).then(result => {
      const { affectedRows } = result;

      if (affectedRows !== 0) {
        resolve("ok");
      }
      //resolve(result);
    });
  });
};

const updateSimpleBlog = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { author, title, content, description, tags, id } = body;
    const createTime = new Date().getTime();

    let sql = `update blog set author='${author}', createTime=${createTime}, title='${title}', content='${content}', description='${description}', tags='${tags}' where id=${id}`;

    exec(sql).then(
      result => {
        const { affectedRows } = result;

        if (affectedRows !== 0) {
          resolve("ok");
        }
      },
      error => {
        console.log(error);
      }
    );
  });
};

const createBlog = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { title, content, author, description, tags } = body || {};
    const createTime = new Date().getTime();
    const sql = `insert into blog(createTime, title, content, author, description, tags) values(${createTime}, '${title}', '${content}', '${author}', '${description}', '${tags}')`;

    exec(sql).then(result => {
      const { affectedRows, insertId } = result;

      if (affectedRows !== 0) {
        resolve(insertId);
      }
    });
  });
};

login = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req;
    const { username, password } = body || {};
    const loginTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const sql = `select * from users  where username='${username}' and password='${password}'`;

    exec(sql).then(
      result => {
        if (!result.length) {
          reject("您还没有注册");

          return;
        }

        //res.setHeader('Set-Cookie', `userName=${username}; path=/;`);
        const { userId } = result[0];

        // 生成token
        const token = jwt.sign(
          { userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
          "json"
        );

        resolve({ userId, token });

        const insertSql = `insert into loginCount(userId, loginTime, loginCount) values('${userId}', '${loginTime}', 1)`;
        exec(insertSql).then(
          res => {
            // resolve({ userId, token });
          },
          error => {
            console.log(error, 22);
          }
        );
      },
      error => {
        console.log(error, 5555);
      }
    );
  });
};

register = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { username, password } = body || {};

    // 把用户名进行加密
    const userId = addSecurit(username);
    const sql = `insert into users(userName, userId, password, nickName, ifUpload) values('${username}', '${userId}', '${password}', 'default', 0)`;

    console.log(sql);
    return exec(sql).then(
      result => {
        const { insertId } = result;

        resolve("ok");
      },
      error => {
        console.log(error);
        reject("创造失败");
      }
    );
  });
};

// 获取个人信息接口
const getUserInfo = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body, ifLogin } = req || {};
    const { userId } = body;
    const sql = `select description, email, imgPath, nickName, signature, tags, userName from users where userId='${userId}'`;

    if (ifLogin) {
      exec(sql).then(result => {
        // 把tags转换成数组
        if (result[0]) {
          result[0].tags =
            typeof result[0].tags === "string" && result[0].tags !== ""
              ? result[0].tags.split(",")
              : [];
        }
        resolve(result[0]);
      });
    } else {
      reject("您没有登录");
    }
  });
};

// 修改个人信息
const editorUserInfo = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { userId } = req.headers;
    const { userName, nickName, email, description, tags, signature } = body;
    const sql = `update users set username='${userName}', nickname='${nickName}', email='${email}', description='${description}', tags='${tags}', signature='${signature}' where userId='${userId}'`;

    exec(sql).then(result => {
      const { affectedRows } = result || {};

      if (affectedRows) {
        resolve("ok");
      } else {
        reject("参数错误");
      }
    });
  });
};

// 上传上传信息
const upload = (req, res) => {
  return new Promise((resolve, reject) => {
    const { userId } = req.headers;
    const form = new formidable.IncomingForm();

    form.uploadDir = "public";
    form.keeyExtendsions = true;

    form.parse(req, (error, fields, files) => {
      const { path, name } = files.file;
      const exot = name.split(".")[1];
      const imgPath = `public/${userId}.${exot}`;
      const sql = `update users set ifUpload=1, imgPath='${imgPath} 'where userId='${userId}'`;

      exec(sql).then(result => {
        fs.rename(path, `public/${userId}.${exot}`, error => {
          resolve(imgPath);
        });
      });
    });
  });
};

// 获取登录总次数接口
const getLoginCount = (req, res) => {
  return new Promise((resolve, reject) => {
    const sql = `select date_format(loginTime, '%Y-%m-%d') as time, count(loginCount) as num from loginCount where date(loginTime) > date(date_sub(now(), interval 7 day)) group by time`;

    exec(sql).then(
      res => {
        if (res.length) {
          resolve(res);
        }
      },
      error => {
        console.log(error);
      }
    );
  });
};

module.exports = {
  getList,
  getSimpleBlog,
  deleteSimple,
  updateSimpleBlog,
  createBlog,
  login,
  register,
  getUserInfo,
  upload,
  editorUserInfo,
  getLoginCount
};
