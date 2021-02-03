import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './app.vue';

Vue.use(ElementUI);
Vue.component('App', App);

const vm = new Vue({ render: h => h(App) });
vm.$mount('#app');
