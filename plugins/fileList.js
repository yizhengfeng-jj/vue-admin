const fs = require("fs");

class fileList {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // 对打包之后的文件做处理，一般都是在emit钩子上做文章
    // emit钩子是异步的钩子
    const { filename } = this.options;

    compiler.hooks.emit.tapAsync("file-list", function(compilation, cb) {
      let fileContent = `### 一共${Object.keys(compilation.assets).length}文件\n`;
      const fileObj = {};

      for (let filename in compilation.assets) {
        // 将filename根据后缀名，集合
        const suffer = filename.split(".").pop();

        if (fileObj[suffer]) {
          fileObj[suffer].push(filename);
        } else {
          fileObj[suffer] = [filename];
        }
      }

      for (let key in fileObj) {
        fileContent = `${fileContent}#### ${key}\n`;

        const files = fileObj[key];

        for (let i = 0; i < files.length; i++) {
          fileContent = `${fileContent}${files[i]}\n\n`;
        }
      }

      // 将filecontent写入compilation.assest里面
      compilation.assets[filename] = {
        source: function() {
          return fileContent;
        },

        size: function() {
          return fileContent.length;
        },
      };

      // 将fileList.md写入src下面
      fs.writeFile(filename, fileContent, (error) => {
        if (error) {
          console.log("写入错误");
        }
      });

      cb();
    });
  }
}

module.exports = fileList;
