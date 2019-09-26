const url = require("url");
const dealPost = (req, res) => {
  return new Promise((resolve, reject) => {
    // 获取post url？后面的数据
    const dataUrl = url.parse(req.url, true);
    let chunks = "";

    req.on("data", chunk => {
      chunks += chunk.toString();
    });

    req.on("end", () => {
      try {
        JSON.parse(chunks);
      } catch (error) {
        reject(error);

        return;
      }

      req.body = { ...JSON.parse(chunks), ...dataUrl.query };
      resolve();
    });
  });
};

const dealGet = (req, res) => {
  const urlInfo = url.parse(req.url, true);
  let { query } = urlInfo || {};
  return query;
};

// 统一路由格式
const dealUrl = url => {
  let urlPath;

  if (!url.endsWith("/")) {
    urlPath = urlPath + "/";
  }

  if (!url.startsWith("/")) {
    urlPath = "/" + urlPath;
  }

  return url;
};

module.exports = {
  dealGet,
  dealPost,
  dealUrl
};
