import Router from "vue-router";
// import Detail from "@/pages/self/Detail";

const Detail = () =>
  import(/* webpackChunkName:"Detail" */ "../../pages/self/Detail");
export default new Router({
  path: "selfDetail",
  name: "selfDetail",
  params: { name: 22 },
  component: Detail
});
