const path = require("path");
const koa = require("koa");
const bodyparser = require("koa-bodyparser");
const koaBody = require("koa-body");

const login = require("./koa-routers/login");
const upload = require("./koa-routers/upload");

const app = new koa();

app.use(
  bodyparser({
    enableTypes: ["json", "form"],
  })
);

app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.resolve(__dirname, "./public"),
    },
  })
);

app.use(login.routes(), login.allowedMethods());
app.use(upload.routes(), upload.allowedMethods());

app.listen(8002, () => {
  console.log("我是koa 服务");
});
