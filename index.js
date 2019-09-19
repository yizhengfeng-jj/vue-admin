const http = require("http");
const { routers } = require("./routers");
const {
  getList,
  getItem,
  deleteItem,
  updateItem,
  create
} = require("./util/dealRequest");
const { SuccessModal, ErrorModal } = require("./src/modal");

http.createServer(routers).listen(8000);

// 注册路由
routers.get("/api/getList", (req, res) => {
  getList(req, res).then(result => {
    res.end(JSON.stringify(new SuccessModal(result, "请求成功")));
  });
});

// 获取单个详情的接口1
routers.get("/api/getItem", (req, res) => {
  getItem(req, res).then(
    result => {
      res.end(JSON.stringify(new SuccessModal(result, "请求成功")));
    },
    error => {
      res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});

// 这个是删除的接口
routers.get("/api/delete", (req, res) => {
  deleteItem(req, res).then(
    result => {
      res.end(JSON.stringify(new SuccessModal("", result)));
    },
    error => {
      res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});

// 这个是更新的接口
routers.post("/api/update", (req, res) => {
  updateItem(req, res).then(result => {
    res.end(JSON.stringify(new SuccessModal("", result)));
  });
});

// 这个是新建的接口
routers.post("/api/create", (req, res) => {
  create(req, res).then(result => {
    res.end(JSON.stringify(new SuccessModal(result, "请求成功")));
  });
});

// 登陆接口
routers.post("/api/login", (req, res) => {
  res.end(JSON.stringify(new SuccessModal({}, "请求成功")));
});
