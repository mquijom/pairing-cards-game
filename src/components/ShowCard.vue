<template>
    <v-dialog
        v-model="show"
        persistent :overlay="false"
        max-width="300px"
        transition="dialog-transition">
        <v-card>
            <v-card-title class="title">
                {{selected_card.card}} of {{selected_card.sign}}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <img :src="selected_card.image_url">
            </v-card-text>
            <v-card-actions>
                <v-btn color="success" :disabled="players_turn!==$store.state.user.name" @click="draw()">Draw</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="cancel()">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    selected_card: {
      type: Object
    },
    players_turn: {
      type: String
    }
  },
  methods: {
    draw() {
      this.$emit("draw");
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style>
</style>
