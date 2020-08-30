const { SuccessModal, ErrorModal } = require("./src/modal");
const { register } = require("./util/dealRequest");

const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
// const { exec } = require("child_process");
const { exec } = require("./util/dataBase");
const upload = multer({ dest: "./public" });

// / x-www-form-urlencoded 解析表单
app.use(bodyParser.urlencoded({ extended: false }));

// 解析json
app.use(bodyParser.json());

// express 的注册接口
app.post("/expressApi/register", (req, res) => {
  res.header("Content-Type", "text/html;charset=utf-8");

  register(req, res).then(
    (result) => {
      return res.end(JSON.stringify(new SuccessModal(result, "注册成功")));
    },
    (error) => {
      return res.end(JSON.stringify(new ErrorModal("", error)));
    }
  );
});

// express的上传图片接口
app.post("/expressApi/upload", upload.any(), (req, res) => {
  req.header("Content-Type", "text/html;charset=utf-8");
  const fileContent = req.files[0];

  // 将public下面的68e8c4607b9176e792f950acaf02c425文件重命名
  const userid = req.headers.userid;

  const { path, originalname = "" } = fileContent;
  const exot = originalname.split(".")[1];
  const imgPath = `public/${userid}.${exot}`;

  const sql = `update users set ifUpload=1, imgPath='${imgPath} 'where userId='${userId}'`;

  exec(sql).then(() => {
    fs.rename(path, imgPath, (data, error) => {
      if (error) {
        res.end(JSON.stringify(new ErrorModal("", error)));

        return;
      }

      res.end(JSON.stringify(new SuccessModal(imgPath, "上传成功")));
    });
  });
});

// app.use("/", (req, res) => {
//   console.log("欢迎使用experss");

//   res.header("Content-Type", "text/html;charset=utf-8");
//   res.end("欢迎使用express");
// });

// 监听8001端口
app.listen("8001", function() {
  console.log("我是8001端口的服务");
});
