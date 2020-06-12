import axios from "axios";

const setLogs = data => {
  const time = new Date().getTime();

  data.time = time;
  axios.post("/api/setLog", data);
};

export default setLogs;
