import { Doughnut } from "vue-chartjs";

export default {
  extends: Doughnut,
  props: {
    formApplicationCount: {
      type: Number,
      default: 0
    },
    admittedStudentsCount: {
      type: Number,
      default: 0
    },
    rejectedStudentsCount: {
      type: Number,
      default: 0
    },
    withdrawnStudentsCount: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.renderChart(
      {
        labels: [
          "طلبات التسجيل",
          "الطلاب المقبولين",
          "الطلاب المرفوضين",
          "الطلاب المنسحبين"
        ],
        datasets: [
          {
            label: "المخطط الدائري لإحصائيات الطلاب",
            backgroundColor: ["#2296F3", "#4CAF4F", "#F44335", "#9D27B0"],
            data: [
              this.formApplicationCount,
              this.admittedStudentsCount,
              this.rejectedStudentsCount,
              this.withdrawnStudentsCount
            ]
          }
        ]
      },
      {
        responsive: true,
        aspectRatio: 1,
        title: {
          display: true,
          position: "top",
          text: "المخطط الدائري لإحصائيات الطلاب",
          fontSize: 18,
          fontColor: "#111",
          fontFamily: "Cairo"
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#333",
            fontSize: 14,
            fontFamily: "Cairo"
          }
        }
      }
    );
  }
};
