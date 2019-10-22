const http = require("http");
const { routers } = require("./routers");
const {
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
} = require("./util/dealRequest");
const { SuccessModal, ErrorModal } = require("./src/modal");

http.createServer(routers).listen(8000);

// 注册路由
routers.get("/api/getList", (req, res) => {
  getList(req, res).then(result => {
    return res.end(JSON.stringify(new SuccessModal(result, "请求成功")));
  });
});

// 获取单个详情的接口
routers.get("/api/getSimpleBlog", (req, res) => {
  getSimpleBlog(req, res).then(
    result => {
      return res.end(JSON.stringify(new SuccessModal(result, "请求成功")));
    },
    error => {
      return res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});

// 这个是删除的接口
routers.get("/api/deleteSimple", (req, res) => {
  deleteSimple(req, res).then(
    result => {
      return res.end(JSON.stringify(new SuccessModal("", result)));
    },
    error => {
      return res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});

// 这个是更新的接chengg
routers.post("/api/updateSimpleBlog", (req, res) => {
  updateSimpleBlog(req, res).then(result => {
    return res.end(JSON.stringify(new SuccessModal("", result)));
  });
});

// 这个是新建的接口
routers.post("/api/createBlog", (req, res) => {
  createBlog(req, res).then(result => {
    return res.end(JSON.stringify(new SuccessModal(result, "请求成功")));
  });
});

// 登陆接口
routers.post("/api/login", (req, res) => {
  //res.end(JSON.stringify(new SuccessModal({}, "请求成功")));
  login(req, res).then(
    result => {
      return res.end(JSON.stringify(new SuccessModal(result, "登录成功")));
    },
    error => {
      return res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});

// 注册接口
routers.post("/api/register", (req, res) => {
  return register(req, res).then(
    result => {
      return res.end(JSON.stringify(new SuccessModal(result, "注册成功")));
    },
    error => {
      return res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});

// 获取个人信息接口
routers.get("/api/getUserInfo", (req, res) => {
  getUserInfo(req, res).then(
    result => {
      return res.end(JSON.stringify(new SuccessModal(result)));
    },
    error => {
      return res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});

// 修改个人接口1
routers.post("/api/editorUserInfo", (req, res) => {
  editorUserInfo(req, res).then(
    result => {
      return res.end(JSON.stringify(new SuccessModal(result)));
    },
    error => {
      return res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});

// 上传接口
routers.post("/api/upload", (req, res) => {
  upload(req, res).then(
    result => {
      return res.end(JSON.stringify(new SuccessModal(result)));
    },
    error => {
      return res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});

// 获取一周登录数据
routers.get("/api/getLoginCount", (req, res) => {
  getLoginCount(req, res).then(
    result => {
      return res.end(JSON.stringify(new SuccessModal(result)));
    },
    error => {
      return res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});
