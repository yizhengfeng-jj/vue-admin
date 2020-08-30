const { login } = require("../util/dealRequest");

const { SuccessModal, ErrorModal } = require("../src/modal");
const router = require("koa-router")();

router.get("/", async (ctx, next) => {
  ctx.body = {
    message: "我是koa的程序",
  };
});

router.post("/koa/login", async (ctx, next) => {
  console.log(ctx.headers);
  console.log(ctx.request.body);

  ctx.body = {
    data: "不能解析",
  };

  await login({ body: ctx.request.body }).then(
    (result) => {
      ctx.body = new SuccessModal(result, "登录成功");
    },
    (error) => {
      ctx.body = {
        error,
      };
    }
  );
});

module.exports = router;
