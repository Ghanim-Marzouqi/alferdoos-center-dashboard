const routes = [
  {
    path: "/",
    component: () => import("pages/PageMain.vue")
  },
  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/admin/dashboard/PageHome.vue")
      }
    ]
  },
  {
    path: "/admin/login",
    component: () => import("pages/admin/PageLogin.vue")
  },
  {
    path: "/admin/reset-password",
    component: () => import("pages/admin/PageResetPassword.vue")
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
  },
  {
    path: "/parent/login",
    component: () => import("pages/parent/PageLogin.vue")
  },
  {
    path: "/parent/register",
    component: () => import("pages/parent/PageRegister.vue")
  },
  {
    path: "/parent/reset-password",
    component: () => import("pages/parent/PageResetPassword.vue")
  },
  {
    path: "/teacher",
    component: () => import("layouts/TeacherLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/teacher/dashboard/PageHome.vue")
      }
    ]
  },
  {
    path: "/teacher/login",
    component: () => import("pages/teacher/PageLogin.vue")
  },
  {
    path: "/teacher/reset-password",
    component: () => import("pages/teacher/PageResetPassword.vue")
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
