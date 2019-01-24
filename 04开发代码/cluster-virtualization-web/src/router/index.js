import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Echarts from '@/components/Echarts'
import Excel from '@/components/Excel'
import Welcome from '@/components/Welcome'
import Dashboard from "../components/Dashboard";

Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/echarts',
      name: 'Echarts',
      component: Echarts
    },
    {
      path: '/excel',
      name: 'Excel',
      component: Excel
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard

    }
  ]
})
