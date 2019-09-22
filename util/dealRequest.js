const { exec } = require("./dataBase");

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
      resole(result);
    });
  });
};

const getItem = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { id } = body;

    const sql = `select * from blog where id=${id}`;

    if (!id) {
      reject("id 是必须的");

      return;
    }

    exec(sql).then(result => {
      resolve(result);
    });
  });
};

const deleteItem = (req, res) => {
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

const updateItem = (req, res) => {
  return new Promise((resolve, reject) => {
    const { body } = req || {};
    const { title, content, id } = body;

    let sql = `update blog set title='${title}', content='${content}' where id=${id}`;

    exec(sql).then(result => {
      const { affectedRows } = result;

      if (affectedRows !== 0) {
        resolve("ok");
      }
    });
  });
};

const create = (req, res) => {
    return new Promise((resolve, reject) => {
        const { body } = req || {};
        const { title, content, author } = body || {};
        const sql = `insert into blog(createTime, title, content, author) values(${new Date().getTime()}, '${title}', '${content}', '${author}')`;

        exec(sql).then(result => {
            const { affectedRows, insertId } = result;

            if (affectedRows !== 0) {
              resolve(insertId);
            }
        })
    })

}

login = (req, res) => {
  return new Promise((resolve,reject) => {
    const { body } = req;
    const { username, password } = body || {};
    const sql = `select * from users  where username='${username}' and password='${password}'`;

    exec(sql).then(res => {
      if (!res.length) {
        reject('您还没有注册');

        return;
      }

      resolve(1);
    })
  })
}

register = (req, res) => {
  return new Promise((resolve,reject) => {
    const { body } = req || {};
    const { username, password } = body || {};
    const sql = `insert into users(username, password, realname) values('${username}', '${password}', 'default')`;

    exec(sql).then(result => {
      const { insertId } = result;

      resolve(insertId);
    }, error => {
      reject('创造失败')
    })
  })  

}
module.exports = {
  getList,
  getItem,
  deleteItem,
  updateItem,
  create,
  login,
  register
};
