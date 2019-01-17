<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-progress-circular
                :size="70"
                :width="7"
                v-show="loading"
                color="blue"
                indeterminate>
            </v-progress-circular>
            <v-card v-show="!loading">
                <v-card-title>
                    <span class="display-2">My Deck</span>
                    <!-- <v-subheader><v-btn color="success" @click="isTurn">test</v-btn></v-subheader> -->
                    <v-spacer></v-spacer>
                    <span class="subheading">Login as: {{user.name}}</span>
                    <v-btn color="success" large @click="logout()" flat icon>
                        <v-icon>power_settings_new</v-icon>
                    </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex v-for="card in cards" v-bind="{ [`xs${cards.length > 6 ? 1 : cards.length > 4 ? 2 : 3}`]: true }" :key="card">
                            <img :src="card.image_url" @click="openCard(card)">
                        </v-flex>
                    </v-layout>
                    <show-card :show="dialog" :selected_card="selected_card" @draw="draw()" @cancel="cancel()"></show-card>
                    <hidden-card :show="show_hidden_card" :hidden_card="hidden_card" @close="close()"></hidden-card>
                    <new-game :show="show_create_game" @exit="exit()"></new-game>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="success" block @click="pair()">Pair</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
  components: {
    NewGame: () => import("@/components/NewGame.vue"),
    HiddenCard: () => import("@/components/HiddenCard.vue"),
    ShowCard: () => import("@/components/ShowCard.vue")
  },
  data: () => ({
    cards: [],
    dialog: false,
    selected_card: {},
    user: {},
    loading: false,
    show_hidden_card: false,
    hidden_card: {},
    show_create_game: false
  }),
  created() {
    this.init();
  },
  //   computed: {
  //     isTurn() {
  //       this.$http
  //         .get("api/cards/isturn/" + this.user._id)
  //         .then(result => {
  //           return result.data.isTurn;
  //         })
  //         .catch(err => {
  //           console.log(err);
  //           return false;
  //         });
  //     }
  //   },
  methods: {
    isTurn() {
      this.$http
        .get("api/cards/isturn/" + this.user._id)
        .then(result => {
          //   return result.data.isTurn;
          console.log(JSON.stringify(result.data));
        })
        .catch(err => {
          console.log(err);
          //   return false;
        });
    },
    init() {
      this.loading = true;
      this.user = this.$store.state.user;
      console.log(JSON.stringify(this.user));
      this.$http
        .get("api/cards/" + this.user._id)
        .then(result => {
          console.log("card: " + JSON.stringify(result.data));
          this.cards = result.data.model.current_game.cards;
          this.loading = false;
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          this.loading = false;
        });
    },
    logout() {
      this.$store.commit("LOGOUT");
      this.$router.push("/");
    },
    pair() {
      this.loading = true;
      this.$http
        .get("api/cards/pair/" + this.user._id)
        .then(result => {
          console.log("card: " + JSON.stringify(result.data));
          if (result.data.message) {
            alert(result.data.message);
          }
          if (result.data.hidden_card) {
            this.hidden_card = result.data.hidden_card;
            this.show_hidden_card = true;
          }
          this.init();
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          this.loading = false;
        });
    },
    openCard(card) {
      this.selected_card = card;
      this.dialog = true;
    },
    cancel() {
      this.selected_card = {};
      this.dialog = false;
    },
    close() {
      this.show_hidden_card = false;
      this.hidden_card = {};
      this.cards = [];
      this.show_create_game = true;
    },
    exit() {
      this.$router.push("/");
    },
    draw() {
      this.loading = true;
      this.dialog = false;
      this.$http
        .post("api/play/" + this.user._id, {
          card: this.selected_card._id
        })
        .then(result => {
          console.log(JSON.stringify(result.data));
          if (result.data.message) {
            alert(result.data.message);
          }
          this.cancel();
          this.init();
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          this.loading = false;
        });
    }
  }
};
</script>

<style>
</style>
