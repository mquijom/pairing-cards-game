<template>
    <v-dialog
        v-model="show"
        persistent :overlay="false"
        max-width="300px"
        transition="dialog-transition">
        <v-card>
            <v-card-title class="title">
                The hidden card: {{hidden_card.card}} of {{hidden_card.sign}}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <img :src="hidden_card.image_url">
            </v-card-text>
            <v-card-actions>
                <v-btn color="error" block @click="close()">Close</v-btn>
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
    hidden_card: {
      type: Object
    }
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style>
</style>
