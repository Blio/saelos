import Page from './page';

export default [
  {
    path: '/',
    exact: true,
    auth: true,
    component: Page
  },
  {
    path: '/headquarters',
    exact: true,
    auth: true,
    component: Page
  },
  {
    path: '/headquarters/:id',
    exact: true,
    auth: true,
    component: Page
  }
];