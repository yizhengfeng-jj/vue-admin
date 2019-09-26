const url = require('url');
const jwt = require('jsonwebtoken');
const { dealPost, dealGet, dealUrl } = require("./dealData");
const routersList = {
  getList: {},
  postList: {}
};


const routers = (req, res) => {
  // 设置中文乱码
 
  res.writeHead(200, { "content-Type": "text/html;charset=utf8" });

  // 获取请求投Authorization
  const authorization = req.headers.authorization;
  let ifLogin;
  try{
    ifLogin = jwt.verify(authorization, 'json');
  }catch{
    ifLogin = false;
  }

  req.ifLogin = ifLogin && true;
 // 把cookie写入cookie
//  res.writeHeader('setCookie', "userInfo=aaa");

  // 获取路由路径
  const urlPath = dealUrl(req.url);
  const routerInfo = url.parse(urlPath);
  const routerPath =  routerInfo && routerInfo.pathname;
  const method = req.method.toLowerCase(); // 方法默认是获取是大写，转换为小写

  if (method === "get" && routersList.getList[routerPath]) {
    req.body = dealGet(req, res);
    routersList.getList[routerPath](req, res); // 执行函数
  }

  if (method === "post" && routersList.postList[routerPath]) {
    // 如果是post的请求把post请求体写入body
    dealPost(req, res).then(() => {
      
      routersList.postList[routerPath](req, res); // 执行函数
    }, error => {
        return res.end(JSON.stringify(error));
    });
  }

  //res.end("输入完成");
};

routers.get = (router, callback) => {
  routersList.getList[dealUrl(router)] = callback;
};

routers.post = (router, callback) => {
  routersList.postList[dealUrl(router)] = callback;
};

module.exports = {
  routers
};
