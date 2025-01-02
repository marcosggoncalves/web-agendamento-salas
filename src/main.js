
import { registerPlugins } from '@/plugins';
import { createPinia } from 'pinia';
import App from './App.vue';
import VueTheMask from 'vue-the-mask';
import { setupCalendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import 'vue3-toastify/dist/index.css';
import 'v-calendar/style.css';

import { createApp, watch} from 'vue';

const app = createApp(App)

const pinia = createPinia()

if (localStorage.getItem("state")) {
    pinia.state.value = JSON.parse(localStorage.getItem("state"));
}

watch(
    pinia.state,
    (state) => {
        localStorage.setItem("state", JSON.stringify(state));
    },
    { deep: true }
)


registerPlugins(app)

app.use(setupCalendar, {})

app.component('DatePicker', DatePicker)

app.use(pinia)

app.use(VueTheMask) 

app.mount('#app')
