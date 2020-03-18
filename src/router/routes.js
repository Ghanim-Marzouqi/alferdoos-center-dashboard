const routes = [
  {
    path: "/",
    component: () => import("layouts/Layout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/user/dashboard/PageHome.vue")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("pages/user/PageLogin.vue")
  },
  {
    path: "/reset-password",
    component: () => import("pages/user/PageResetPassword.vue")
  },
  {
    path: "/parent-login",
    component: () => import("pages/parent/PageLogin.vue")
  },
  {
    path: "/parent-register",
    component: () => import("pages/parent/PageRegister.vue")
  },
  {
    path: "/parent-reset-password",
    component: () => import("pages/parent/PageResetPassword.vue")
  },
  {
    path: "/parent",
    component: () => import("layouts/ParentLayout.vue"),
    children: [
      {
        path: "",
        component: () =>
          import("pages/parent/dashboard/PageStudentRegister.vue")
      }
    ]
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
