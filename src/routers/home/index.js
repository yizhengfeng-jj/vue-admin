import Router from "vue-router";
import Home from "@/pages/home/index";
import dashboard from "../dashboard";
import selfDetail from "../self/detail";
import selfEditor from "../self/editor";
import createEditorBlogs from "../blogs/createEditor";
import showBlogs from "../blogs/showBlogs";

const detailRouter = selfDetail.options;
const editorRouter = selfEditor.options;
const createRouter = createEditorBlogs.options;
const showRouter = showBlogs.options;
const dashboardRouter = dashboard.options;
console.log(dashboardRouter, dashboard, selfDetail, 'dashboardRouter..')

export default new Router({
  path: "/home",
  name: "home",
  component: Home,
  children: [
    detailRouter,
    editorRouter,
    createRouter,
    showRouter,
    dashboardRouter
  ]
});
