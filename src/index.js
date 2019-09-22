import Vue from 'vue';
import router from './routers'
import App from './app.vue';

const app = new Vue({
    el: '#root',
    router,
    components: {
        App
    }
});