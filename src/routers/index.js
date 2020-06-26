import Vue from "vue";
import Router from "vue-router";
// import Login from "../pages/login.vue";
// import Register from "../pages/register.vue";
// import Home from '@/pages/home/index'

const Login = () => import(/* webpackChunkName: "login" */ "../pages/login.vue");
const Register = () => import(/* webpackChunkName: "register" */ "../pages/register.vue");

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
