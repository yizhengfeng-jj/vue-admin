import axios from "axios";
import store from "store";

axios.interceptors.request.use(config => {
  const { token } = store.get("userInfo") || {};

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export default axios;
