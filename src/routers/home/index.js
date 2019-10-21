import Router from "vue-router";
import selfDetail from "../self/detail";
import selfEditor from "../self/editor";
import createEditorBlogs from "../blogs/createEditor";
import showBlogs from "../blogs/showBlogs";
import Home from "@/pages/home/index";

const detailRouter = selfDetail.options;
const editorRouter = selfEditor.options;
const createRouter = createEditorBlogs.options;
const showRouter = showBlogs.options;

export default new Router({
  path: "/home",
  name: "home",
  component: Home,
  children: [detailRouter, editorRouter, createRouter, showRouter]
});
