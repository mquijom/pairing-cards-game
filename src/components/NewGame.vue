<template>
    <v-dialog
        v-model="show"
        persistent :overlay="false"
        max-width="300px"
        transition="dialog-transition">
        <v-card>
            <v-card-title class="display-2">
                Play Again ?
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <span>Please select atleast 2 players</span>
                <v-autocomplete v-model="selected_players" :items="players" label="Players" multiple item-value="_id" item-text="name"></v-autocomplete>
            </v-card-text>
            <v-card-actions>
                <v-btn color="success" @click="playAgain()">Play Again</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="error" @click="exit()">Close</v-btn>
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
    }
  },
  data: () => ({
    selected_players: [],
    players: [],
    show_error: false
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      this.$http
        .get("api/play/players")
        .then(result => {
          var players = [];
          result.data.forEach(player => {
            if (
              player._id.toString() !== this.$store.state.user._id.toString()
            ) {
              players.push(player);
            }
          });
          this.players = players;
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
    },
    playAgain() {
      this.show_error = false;
      if (this.selected_players.length !== 0) {
        this.selected_players.push(this.$store.state.user._id);
        this.$http
          .post("api/play/create", {
            created_by: this.$store.state.user._id,
            players: this.selected_players
          })
          .then(result => {
            console.log(JSON.stringify(result.data));
            this.exit();
          })
          .catch(err => {
            console.log(JSON.stringify(err));
          });
      } else {
        this.show_error = true;
      }
    },
    exit() {
      this.selected_players = [];
      this.players = [];
      this.$emit("exit");
    }
  }
};
</script>

<style>
</style>
