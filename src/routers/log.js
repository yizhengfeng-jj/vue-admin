import Router from "vue-router";
// import Log from "@/pages/log";

const Log = () => import(/* webpackChunkName:"log" */ "../pages/log");
export default new Router({
  name: "log",
  path: "log",
  component: Log
});
