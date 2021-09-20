import Vue from 'vue';
import Router from 'vue-router';
import DashboardLayout from '../views/Starter/SampleLayout.vue';
import Starter from '../views/Starter/SamplePage.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/inicio',
      component: DashboardLayout,
      children: [
        {
          path: 'inicio',
          name: 'inicio',
          components: { default: Starter }
        }
      ]
    }
  ],
  scrollBehavior: (to, from ,savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  }
});
