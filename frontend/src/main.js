import './assets/main.css'

import { createApp } from 'vue'

// import the ROOT COMPONENT App from a single-file component.
import App from './App.vue'

//An application instance won't render anything until its .mount() method is called. It expects a "container" argument
createApp(App).mount('#app')
