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

const app1 = new Vue({
    el: 'add',
    data: function() {
        return {
            name: 'json'
        }
    },
    props: {
        age: String
    },
    methods: {
        getName: function() {}
    },
    watch: {
        name: function() {}
    }
})