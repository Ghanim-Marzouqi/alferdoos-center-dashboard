import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
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
          "الطلاب المنسحبين",
          "الطلاب المرفوضين",
          "الطلاب المقبولين",
          "طلبات التسجيل"
        ],
        datasets: [
          {
            label: "",
            barPercentage: 1,
            barThickness: 50,
            backgroundColor: ["#9D27B0", "#F44335", "#4CAF4F", "#2296F3"],
            data: [
              this.withdrawnStudentsCount,
              this.rejectedStudentsCount,
              this.admittedStudentsCount,
              this.formApplicationCount
            ]
          }
        ]
      },
      {
        title: {
          display: true,
          position: "top",
          text: "الرسم البياني لإحصائيات الطلاب",
          fontSize: 18,
          fontColor: "#111",
          fontFamily: "Cairo"
        },
        legend: { display: false },
        scales: {
          yAxes: [
            {
              display: true,
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    );
  }
};
