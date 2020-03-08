const routes = [
  {
    path: "/",
    component: () => import("layouts/Layout.vue"),
    children: [{ path: "", component: () => import("pages/PageHome.vue") }]
  },
  {
    path: "/login",
    component: () => import("pages/PageLogin.vue")
  },
  {
    path: "/reset-password",
    component: () => import("pages/PageResetPassword.vue")
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/PageError404.vue")
  });
}

export default routes;
