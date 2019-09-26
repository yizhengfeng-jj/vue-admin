import Vue from "vue";
import Router from "vue-router";
import Login from "../pages/login.vue";
import Register from "../pages/register.vue";
// import Home from '@/pages/home/index'

import home from "./home";

const homeRouter = home.options;

Vue.use(Router);
export default new Router({
  routes: [
    {
      path: "/",
      name: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    homeRouter
  ]
});
