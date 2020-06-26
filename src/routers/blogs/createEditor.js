import Router from 'vue-router';
// import CreateBlogs from '@/pages/blogs/CreateBlogs';

const CreateBlogs = () => import(/* webpackChunkName: "createBlogs" */ '../../pages/blogs/CreateBlogs');

export default new Router({
    name: 'createBlogs',
    path: 'blogs/info/:type',
    component: CreateBlogs
})