import axios from "@/service/http";

const getData = () => {
  return new Promise((resolve, reject) => {
    const getData = () => {
      axios(`/api/test?time=${new Date().getTime()}`).then(res => {
        if (res && res.data && res.data.status === 0) {
          setTimeout(() => {
            getData();
          }, 500);
        } else {
          resolve("ok");
        }
      });
    };

    getData();
  });
};

const submit = () => {
  return new Promise((resolve, reject) => {
    const body = [
      {
        filters: {
          must: [
            {
              "@timestamp": {
                from: 1413282718215,
                to: 1571049118215
              }
            }
          ],
          must_not: []
        },
        logGroup: "fe5b7f96-443a-11e7-a467-000c29253e90",
        needFieldList: true,
        query:
          "*|bucket datehistorgram(@timestamp) interval=1w timezone='Asia/Shanghai' mindoccount=1 as 2",
        size: 500,
        sort: [
          {
            "@timestamp": "desc"
          }
        ]
      }
    ];

    axios.post("/api/submit", body).then(res => {
      if (res.data.status === 3) {
        resolve("ok");
      }
    });
  });
};

submit().then(res => {
  getData().then(res => {
    console.log(res);
  });
});
