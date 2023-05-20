import 'babel-polyfill'
import {createApp} from 'vue/dist/vue.esm-bundler';
import Example from "./include/Example.vue";

const app = createApp({
        mounted() {

        },
        data() {
            return {}
        },
    })
;

app.component('Example', Example)

document.addEventListener('DOMContentLoaded', function () {
    app.mount('#app')
});

