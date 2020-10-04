const { exec, query } = require("./dataBase");
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

    exec(sql).then((result) => {
      // 对result的tags做处理
      const res = result.map((item) => {
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

    exec(sql).then((result) => {
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

    exec(sql).then((result) => {
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
      (result) => {
        const { affectedRows } = result;

        if (affectedRows !== 0) {
          resolve("ok");
        }
      },
      (error) => {}
    );
  });
};

const createBlog = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { title, content, author, description, tags } = body || {};
    const createTime = new Date().getTime();
    const sql = `insert into blog(createTime, title, content, author, description, tags) values(${createTime}, '${title}', '${content}', '${author}', '${description}', '${tags}')`;

    exec(sql).then((result) => {
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
    const sql = `select * from users  where username=? and password=?`;

    exec(sql, [username, password]).then(
      (result) => {
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

        // 在这里做一层判断，如果有登陆信息，就更改登录次数，如果没有就插入
        const ifHasLoinSql = `Select * from loginCount where userId='${userId}'`;

        exec(ifHasLoinSql).then((result) => {
          const unLoging = Array.isArray(result) ? !result.length : true;
          let sql;

          // 如果没有插入
          if (unLoging) {
            sql = `insert into loginCount(userId, loginTime, loginCount) values('${userId}', '${loginTime}', 1)`;
          } else {
            sql = `update loginCount set loginCount=loginCount + 1`;
          }

          exec(sql).then(
            (res) => {
              resolve({ userId, token });
            },
            (error) => {
              console.log(error, 22);
            }
          );
        });
        // const insertSql = `insert into loginCount(userId, loginTime, loginCount) values('${userId}', '${loginTime}', 1)`;
      },
      (error) => {
        console.log(error, 5555);
      }
    );
  });
};

register = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { username, password } = body || {};

    // 首先判断存不存在数据库
    const sql = `select * from users where username='${username}' and password='${password}'`;
    console.log(username, password);
    console.log(sql, "sql..");
    exec(sql).then((res) => {
      // 把用户名进行加密
      console.log(res, "res....");

      if (!res.length) {
        // 如果没有再去创建
        const userId = addSecurit(username);
        const sql = `insert into users(userName, userId, password, nickName, ifUpload) values('${username}', '${userId}', '${password}', 'default', 0)`;

        return exec(sql).then(
          (result) => {
            const { insertId } = result;

            resolve("ok");
          },
          (error) => {
            reject("创造失败");
          }
        );
      } else {
        // 已经存在提示已存在
        reject("该用户已存在");
      }
    });
  });
};

// 获取个人信息接口
const getUserInfo = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body, ifLogin } = req || {};
    const { userId } = body;
    const sql = `select description, email, imgPath, nickName, address, tags, userName from users where userId='${userId}'`;

    if (ifLogin) {
      exec(sql).then((result) => {
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
      console.log("rrraaa", ifLogin, "ifLogin...");
      reject("您没有登录");
    }
  });
};

// 修改个人信息
const editorUserInfo = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { userid } = req.headers;
    const { userName, nickName, email, description, tags, address } = body;
    const sql = `update users set username='${userName}', nickname='${nickName}', email='${email}', description='${description}', tags='${tags}', address='${address}' where userId='${userid}'`;

    exec(sql).then((result) => {
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
    const userId = req.headers.userid;
    const form = new formidable.IncomingForm();

    form.uploadDir = "public";
    form.keeyExtendsions = true;
    form.parse(req, (error, fields, files) => {
      const { path, name } = files.file;
      const exot = name.split(".")[1];
      const imgPath = `public/${userId}.${exot}`;
      const sql = `update users set ifUpload=1, imgPath='${imgPath} 'where userId='${userId}'`;
      console.log(path, "path......");
      exec(sql).then((result) => {
        fs.rename(path, `public/${userId}.${exot}`, (error) => {
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
      (res) => {
        // if (res.length) {
        //   resolve(res);
        // }
        resolve(res);
      },
      (error) => {
        console.log(error);
      }
    );
  });
};

// 获取标签云接口
const getWordCloud = (req, res) => {
  return new Promise((resolve, reject) => {
    const sql = `select tags from blog`;

    exec(sql).then((res) => {
      let tagsArr = [];
      let result = [];
      const objTags = {};

      res.forEach((item) => {
        const { tags } = item || {};
        const arr = typeof tags === "string" ? tags.split(",") : tags;
        tagsArr = tagsArr.concat(arr);
      });

      tagsArr.forEach((item) => {
        if (!objTags[item]) {
          objTags[item] = 1;
        } else {
          objTags[item] += 1;
        }
      });

      for (let key in objTags) {
        if (Object.prototype.hasOwnProperty.call(objTags, key)) {
          result.push({ name: key, weight: objTags[key] });
        }
      }

      resolve(result);
    });
  });
};

// 获取活跃用户
const getActiveAuthor = (req, res) => {
  return new Promise((resolve, reject) => {
    const sql = `select author,count(author) as num from blog group by author`;

    exec(sql).then((result) => {
      resolve(result);
    });
  });
};

// 获取最大博客量用户信息
const getMaxBlog = (req, res) => {
  return new Promise((resolve, reject) => {
    const sql = `select author,count(author) as num from blog group by author order by num desc limit 1`;

    exec(sql).then((result) => {
      const data = Array.isArray(result) ? result[0] : result;

      resolve(data);
    });
  });
};

// const test = (req, res) => {
//   const sleep = false;
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('得到结果');
//     }, 35000);
//   })
// }

// 获取一周内00：00-24:00 内的发布文章散点图
const getOneDayForScatter = (req, res) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT T.timeHour, COUNT(T.timeHour) as number from (SELECT CONCAT(HOUR(FROM_UNIXTIME(createTime / 1000)), ':00') as timeHour from blog) as T GROUP BY T.timeHour`;

    exec(sql).then((result) => {
      const data = Array.isArray(result) ? result : [];

      resolve(data);
    });
  });
};

// 文章发布作者位置图
const authorAddress = (req, res) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT address, username, userId FROM users`;

    exec(sql).then((res) => {
      resolve(res);
    });
  });
};

// 获取日志操作接口
const getLogs = (req, res) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT level, time, user, action, description FROM log`;

    exec(sql).then((res) => {
      resolve(res);
    });
  });
};

// 设置日志操作
const setLogs = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req; // 数据统一通过body获取

    // 获取关键字段
    const { level, time, user, action, description } = body;

    const sql = `INSERT INTO log(level, time, user, action, description) values(${level}, '${time}', '${user}', '${action}', '${description}')`;

    exec(sql).then((res) => {
      resolve(true);
    });
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
  getLoginCount,
  getWordCloud,
  getActiveAuthor,
  getMaxBlog,
  getOneDayForScatter,
  authorAddress,
  getLogs,
  setLogs,
};
