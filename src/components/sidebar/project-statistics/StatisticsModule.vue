<template>
  <div
    v-if="project.boardHistory"
    class="settings-list animate box-shadow scrollbar"
  >
    <div class="text left">
      <div class="module-title">
        {{ project.name }}
      </div>
      <div class="stats">
        <div class="board-stats flex row vertical">
          <div class="stat-title">
            Boards: <span class="colored-number">{{ infoBoard }}</span>
          </div>
          <div
            v-if="project.boardHistory && project.boardHistory.length > 2"
            class="numbers"
          >
            <TrendChart
              @mouse-move="onMouseMoveBoard"
              :interactive="true"
              :className="'trend-chart'"
              :datasets="[
                {
                  data: project.boardHistory,
                  fill: true,
                  showPoints: true
                }
              ]"
              :min="0"
            >
            </TrendChart>
          </div>
        </div>
        <div class="board-stats flex row vertical">
          <div class="stat-title">
            Groups: <span class="colored-number">{{ infoGroup }}</span>
          </div>
          <div
            v-if="project.groupHistory && project.groupHistory.length > 2"
            class="numbers"
          >
            <TrendChart
              @mouse-move="onMouseMoveGroup"
              :interactive="true"
              :className="'trend-chart'"
              :datasets="[
                {
                  data: project.groupHistory,
                  fill: true,
                  showPoints: true
                }
              ]"
              :min="0"
            >
            </TrendChart>
          </div>
        </div>
        <div class="board-stats flex row vertical">
          <div class="stat-title">
            Tasks: <span class="colored-number">{{ infoTask }}</span>
          </div>
          <div
            v-if="project.taskHistory && project.taskHistory.length > 2"
            class="numbers"
          >
            <TrendChart
              @mouse-move="onMouseMoveTask"
              :interactive="true"
              :className="'trend-chart'"
              :datasets="[
                {
                  data: project.taskHistory,
                  fill: true,
                  showPoints: true
                }
              ]"
              :min="0"
            >
            </TrendChart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrendChart from "vue-trend-chart";
export default {
  name: "StatisticsModule",
  components: { TrendChart },
  props: {
    project: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  mounted() {
    this.boardData = this.project.boards;
    this.groupData = this.project.groups;
    this.taskData = this.project.tasks;
  },
  data() {
    return {
      boardData: 0,
      groupData: 0,
      taskData: 0
    };
  },
  computed: {
    infoBoard() {
      return this.boardData ? this.boardData : this.project.boards;
    },
    infoGroup() {
      return this.groupData ? this.groupData : this.project.groups;
    },
    infoTask() {
      return this.taskData ? this.taskData : this.project.tasks;
    }
  },
  methods: {
    onMouseMoveBoard(params) {
      if (!params) {
        this.boardData = null;
        return;
      }
      this.boardData = params.data[0];
    },
    onMouseMoveGroup(params) {
      if (!params) {
        this.groupData = null;
        return;
      }
      this.groupData = params.data[0];
    },
    onMouseMoveTask(params) {
      if (!params) {
        this.taskData = null;
        return;
      }
      this.taskData = params.data[0];
    }
  }
};
</script>

<style lang="scss">
.statistics-module {
  background-color: var(--group-background);
  margin: 10px;
  width: calc(100% - 20px);
  padding: 10px;
  overflow-y: overlay;
  height: max-content;
}

.numbers {
  height: 200px;
  padding: 20px;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  .stat-title {
    margin-bottom: 10px;
    font-size: 20px;

    .colored-number {
      color: var(--accent-1);
    }
  }
}

.module-title {
  font-size: 24px;
}

.curve {
  .stroke {
    stroke: var(--accent-1);
  }
  .fill {
    fill: var(--accent-1);
  }
  .point {
    fill: var(--accent-1);
    stroke: var(--accent-1);
  }
}

.stroke {
  stroke-width: 2;
}
.fill {
  opacity: 0.2;
}
.active-line {
  stroke: rgba(0, 0, 0, 0.2);
}
.point {
  display: none;
}
.point.is-active {
  display: block;
}
</style>
