import Router from "vue-router";
// import Dashboard from "@/pages/dashboard";

const Dashboard = () =>
  import(/* webpackChunkName:"dashborad" */ "../pages/dashboard");
export default new Router({
  name: "dashborad",
  path: "dashboard",
  component: Dashboard
});
