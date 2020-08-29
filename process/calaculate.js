// 计算熏染的子进程

process.on("message", (data) => {
  if (data === "test") {
    // 执行一个密集计算
    for (let i = 0; i < 5000000000; i++) {
      var a = 12;
    }

    // 执行完之后，发送子进程的id
    process.send(process.pid);
  }
});
