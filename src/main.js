(function() {
  try {
    const tema = localStorage.getItem('tema')
    if (tema === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (tema === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  } catch (e) {}
})()

import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'

createApp(App).mount('#app')
