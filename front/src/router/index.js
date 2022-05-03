import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import Profil from "@/views/Profil.vue";
import Home from "@/views/Home.vue";

const routes = [
  { 
    name: 'login',
    path: '/', 
    component: Login,
  },
  { 
    name: 'profil',
    path: '/profil', 
    component: Profil,
    props:true 
  },
  {
    name: 'home',
    path: '/home',
    component: Home,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;