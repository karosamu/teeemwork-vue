<template>
  <input
    :id="board.id"
    v-model="allowPublic"
    type="checkbox"
    @change="setAllow(board.id)"
  />
</template>

<script>
import { boardsRef } from "../../../../main";
import { log } from "../../../../utils/log";
export default {
  name: "SettingsList",
  props: {
    board: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      allowPublic: false
    };
  },
  mounted() {
    this.allowPublic = this.board.allowPublic;
  },
  methods: {
    setAllow(id) {
      boardsRef
        .doc(id)
        .update({
          allowPublic: !this.board.allowPublic
        })
        .then(
          log(
            `Changed ${
              this.board.name
            } settings: Allow to share this board publicly to ${
              this.board.allowPublic ? "Disabled" : "Enabled"
            }`,
            this.$route.params.projectid,
            "settings"
          )
        );
    }
  }
};
</script>
