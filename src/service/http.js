import axios from "axios";
import store from "store";

axios.interceptors.request.use(config => {
  const { token, userId } = store.get("httpInfo") || {};

  if (token) {
    config.headers.Authorization = token;
    config.headers.userId = userId;
  }

  return config;
});

axios.interceptors.response.use(result => {

  return result.data;
});

export default axios;
