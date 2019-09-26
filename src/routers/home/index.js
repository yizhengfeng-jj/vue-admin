import Router from 'vue-router';
import selfDetail from './selfDetail';
import selfEditor from './selfEditor';
import Home from '@/pages/home/index'

const detailRouter = selfDetail.options;
const editorRouter = selfEditor.options;

export default new Router({
    path: '/home',
    name: 'home',
    component: Home,
    children: [detailRouter, editorRouter]
})