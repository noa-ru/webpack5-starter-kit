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

function onReady() {
    app.mount('#app')
}

if (document.readyState !== "loading") {
    onReady();
} else {
    document.addEventListener("DOMContentLoaded", onReady);
}
