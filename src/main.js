import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './editor/store/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import piniaPersist from 'pinia-plugin-persist'
import { createPinia } from 'pinia'
import {stepManager} from './graph/util/stepManager'
const app = createApp(App)
app.use(ElementPlus)
app.config.globalProperties.$stepManager = stepManager
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia().use(piniaPersist)).mount('#app')

