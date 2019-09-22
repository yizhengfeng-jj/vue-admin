import Vue from 'vue';
import Router from 'vue-router';
import Login from '../pages/login.vue';
import Register from '../pages/register.vue';

console.log(Login);
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        }
    ]
})