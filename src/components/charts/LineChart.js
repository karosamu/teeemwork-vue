import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    data: Array,
    options: Object
  },
  mounted() {
    this.renderChart(this.data, this.options);
  }
};
