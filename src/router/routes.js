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
        path: "student-registration-forms",
        component: () =>
          import("pages/admin/students/PageRegistrationForms.vue")
      },
      {
        path: "edit-expance",
        component: () =>
          import("pages/admin/settings/PageEditExpanse.vue")
      },
      {
        name: "edit-meetings",
        path: "edit-meetings",
        component: () =>
          import("pages/admin/settings/PageEditMeetings.vue")
      },
      {
        path:  "add-entries-page",
        component: () =>
          import("pages/admin/settings/PageEditEntries.vue")
      },
      {
        name : "add-meetings-page",
        path: "add-meetings-page",
        props: true,
        component: () =>
          import("pages/admin/settings/PageAddMeetingsDetails.vue")
      },
      {
        name : "add-message-page",
        path: "add-message-page",
        props: true,
        component: () =>
          import("pages/admin/PageAddMessage.vue")
      },
      {
        path: "admin-message-page",
        component: () =>
          import("pages/admin/PageAdminMessages.vue")
      },
      {
        path: "exams-dashboard",
        component: () => import("pages/admin/students/PageExamsDashboard.vue")
      },
      {
        path: "take-exam",
        component: () => import("pages/admin/students/PageTakeExam.vue")
      },
      {
        path: "exam-results",
        component: () => import("pages/admin/students/PageExamResults.vue")
      },
      {
        path: "student-list",
        component: () => import("pages/admin/students/PageStudentList.vue")
      },
      {
        path: ":id/student-dashboard",
        component: () => import("pages/admin/students/PageStudentDashboard.vue")
      },
      {
        path: "teachers",
        component: () =>
          import("pages/admin/teachers/PageRegisteredTeachers.vue")
      },
      {
        path: "groups",
        component: () => import("pages/admin/groups/PageRegisteredGroups.vue")
      },
      {
        path: "group-schedule",
        component: () => import("pages/admin/groups/PageGroupSchedule.vue")
      },
      {
        path: "absence-records",
        component: () => import("pages/admin/groups/PageStudentAbsenceRecords.vue")
      },
      {
        path: "absence-records-report",
        component: () => import("pages/admin/groups/ReportStudentAttendance.vue")
      },
      {
        path: "settings-year-info",
        component: () => import("pages/admin/settings/PageYearInfoSettings.vue")
      },
      {
        path: "settings-prepare-exams",
        component: () => import("pages/admin/settings/PagePrepareExams.vue")
      },
      {
        path: "settings-edit-memorizations",
        component: () =>
          import("pages/admin/settings/PageEditMemorizations.vue")
      },
      {
        path: "settings-edit-subjects",
        component: () => import("pages/admin/settings/PageEditSubjects.vue")
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
        name: "student-sheduale",
        path: "student-sheduale",
        props: true,
        component: () => import("pages/parent/students/PageStudentSchedule.vue")
      },
      {
        path: "register-student",
        component: () => import("pages/parent/students/PageStudentRegister.vue")
      },
      {
        path: "registration-applications",
        component: () =>
          import("pages/parent/students/PageRegistrationApplications.vue")
      },
      {
        path: "students-list",
        component: () =>
          import("pages/parent/students/PageParentStudentsList.vue")
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
      },
      {
        name: "teacher-sheduale",
        path: "teacher-sheduale",
        props: true,
        component: () => import("pages/teacher/PageTeacherSchedule.vue")
      },
      
      {
        path: "teacher-inbox",
        component: () => import("pages/teacher/PageTeacherInbox.vue")
      },
      {
        path: "group-attendence",
        component: () => import("pages/teacher/PageGroupAttendence.vue")
      },
      {
        path: "student-behaviors",
        component: () => import("pages/teacher/PageEditStudentBehaviors.vue")
      },
      {
        path: "student-activities",
        component: () => import("pages/teacher/PageEditStudentActivities.vue")
      },
      {
        path: "subject-marks",
        component: () => import("pages/teacher/PageSetSubjectMarks.vue")
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
