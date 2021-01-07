import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './app.vue';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

const vm = new Vue({ render: h => h(App) });
vm.$mount('#app');
