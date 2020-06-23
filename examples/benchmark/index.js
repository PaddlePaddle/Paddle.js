// index.js
import Vue from 'vue'
import App from './app.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

const vm = new Vue({render: h => h(App)})
vm.$mount('#app')
