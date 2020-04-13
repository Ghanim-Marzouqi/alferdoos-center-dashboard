const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("pages/PageMain.vue")
  },
  {
    path: "/admin-login",
    component: () => import("pages/admin/auth/PageLogin.vue")
  },
  {
    path: "/admin-reset-password",
    component: () => import("pages/admin/auth/PageResetPassword.vue")
  },
  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    redirect: "/admin/home",
    children: [
      {
        path: "home",
        component: () => import("pages/admin/PageHome.vue")
      },
      {
        path: "student-list",
        component: () => import("pages/admin/students/PageStudentList.vue")
      },
      {
        path: "student-registration-forms",
        component: () =>
          import("pages/admin/students/PageRegistrationForms.vue")
      },
      {
        path: ":id/student-dashboard",
        component: () => import("pages/admin/students/PageStudentDashboard.vue")
      },
      {
        path: "settings-year-info",
        component: () => import("pages/admin/settings/PageYearInfoSettings.vue")
      }
    ]
  },
  {
    path: "/parent-login",
    component: () => import("pages/parent/auth/PageLogin.vue")
  },
  {
    path: "/parent-register",
    component: () => import("pages/parent/auth/PageRegister.vue")
  },
  {
    path: "/parent-reset-password",
    component: () => import("pages/parent/auth/PageResetPassword.vue")
  },
  {
    path: "/parent",
    component: () => import("layouts/ParentLayout.vue"),
    children: [
      {
        path: "",
        redirect: "/parent/register-student"
      },
      {
        path: "register-student",
        component: () => import("pages/parent/students/PageStudentRegister.vue")
      },
      {
        path: "registration-applications",
        component: () =>
          import("pages/parent/students/PageRegistrationApplications.vue")
      }
    ]
  },
  {
    path: "/teacher-login",
    component: () => import("pages/teacher/auth/PageLogin.vue")
  },
  {
    path: "/teacher-reset-password",
    component: () => import("pages/teacher/auth/PageResetPassword.vue")
  },
  {
    path: "/teacher",
    component: () => import("layouts/TeacherLayout.vue"),
    redirect: "/teacher/home",
    children: [
      {
        path: "home",
        component: () => import("pages/teacher/PageHome.vue")
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
