import Router from "vue-router";
// import Editor from '@/pages/self/Editor';

const Editor = () =>
  import(/* webpackChunkName:"Editor" */ "../../pages/self/Editor");
export default new Router({
  path: "selfEditor",
  name: "selfEditor",
  component: Editor
});
