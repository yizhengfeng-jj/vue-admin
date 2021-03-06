import Router from "vue-router";
// import ShowBlogs from "@/pages/blogs/ShowBlogs";

const ShowBlogs = () =>
  import(/* webpackChunkName:"showBlogs" */ "../../pages/blogs/ShowBlogs");

export default new Router({
  name: "showBlogs",
  path: "blogs/show",
  component: ShowBlogs
});
