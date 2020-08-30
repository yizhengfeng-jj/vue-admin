const fs = require("fs");
const router = require("koa-router")();

const { SuccessModal, ErrorModal } = require("../src/modal");
const { exec } = require("../util/dataBase");
router.post("/koa/upload", async (ctx, next) => {
  const { file } = ctx.request.files;
  const { userid } = ctx.headers;
  const { path, name = "" } = file;
  const exot = name.split(".")[1];
  const imgPath = `public/${userid}.${exot}`;
  const sql = `update users set ifUpload=1, imgPath='${imgPath} 'where userId='${userid}'`;

  await exec(sql).then(() => {
    // 重命名path文件
    console.log("rrr");
    fs.renameSync(path, imgPath);

    ctx.body = new SuccessModal(imgPath, "上传成功");
  });
});

module.exports = router;
