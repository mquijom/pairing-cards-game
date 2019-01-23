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
                    <div>
                      <span class="display-2" v-if="players_turn===user.name">Your turn</span>
                      <span class="display-2" v-else-if="players_turn">{{players_turn}}'s turn</span>
                      <!-- <v-btn color="info" @click="shuffle" flat icon>
                        <v-icon>shuffle</v-icon>
                      </v-btn> -->
                      <v-btn color="success" icon flat @click="startPolling()">
                        <v-icon>refresh</v-icon>
                      </v-btn>
                    </div>
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
                            <v-hover>
                              <img 
                                slot-scope="{ hover }" 
                                :class="`elevation-${hover ? 24 : 2}`" 
                                :src="card.image_url" 
                                v-show="!hide"
                                @click="openCard(card)">
                            </v-hover>
                        </v-flex>
                    </v-layout>
                    <show-card :show="pick_card" :players_turn="players_turn" :selected_card="selected_card" @draw="draw()" @cancel="cancel()"></show-card>
                    <hidden-card :show="show_hidden_card" :hidden_card="hidden_card" @close="close()"></hidden-card>
                    <new-game :show="show_create_game" @exit="exit()"></new-game>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="success" block @click="pair()">Pair</v-btn>
                    <v-btn color="info" block @click="hide=!hide">{{hide?'Show':'Hide'}}</v-btn>
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
    pick_card: false,
    selected_card: {},
    user: {},
    loading: false,
    show_hidden_card: false,
    hidden_card: {},
    show_create_game: false,
    polling: null,
    players_turn: "",
    poll_interval: 1000,
    hide: false
  }),
  created() {
    this.init();
  },
  // watch: {
  //   pick_card(val) {
  //     if (val) {
  //       clearInterval(this.polling);
  //     } else {
  //       this.startPolling();
  //     }
  //   }
  // },
  methods: {
    startPolling() {
      // this.polling = setInterval(() => {
      this.loadCards(() => {
        this.$http
          .get("api/cards/isturn/" + this.user.id)
          .then(result => {
            //   return result.data.isTurn;
            console.log(JSON.stringify(result.data));
            this.players_turn = result.data.players_turn;
            // this.poll_interval = 10000;
          })
          .catch(err => {
            console.log(err);
            //   return false;
          });
      });
      // }, this.poll_interval);
    },
    init() {
      this.loading = true;
      this.user = this.$store.state.user;
      console.log(JSON.stringify(this.user));
      this.loadCards(() => {
        this.loading = false;
        this.startPolling();
      });
    },
    loadCards(cb) {
      this.$http
        .get("api/cards/" + this.user.id)
        .then(result => {
          console.log("card: " + JSON.stringify(result.data));
          this.cards = result.data.cards;
          cb();
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          cb();
        });
    },
    logout() {
      clearInterval(this.polling);
      this.$store.commit("LOGOUT");
      this.$router.push("/");
    },
    pair() {
      this.loading = true;
      this.$http
        .get("api/cards/pair/" + this.user.id)
        .then(result => {
          console.log("card: " + JSON.stringify(result.data));
          if (result.data.message) {
            alert(result.data.message);
          }
          if (result.data.hidden_card) {
            this.hidden_card = result.data.hidden_card;
            this.show_hidden_card = true;
          }
          this.loadCards(() => {
            this.loading = false;
          });
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          this.loading = false;
        });
    },
    openCard(card) {
      this.selected_card = card;
      this.pick_card = true;
    },
    cancel() {
      this.selected_card = {};
      this.pick_card = false;
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
    // shuffle() {
    //   var currentIndex = this.cards.length,
    //     temporaryValue,
    //     randomIndex;

    //   // While there remain elements to shuffle...
    //   while (0 !== currentIndex) {
    //     // Pick a remaining element...
    //     randomIndex = Math.floor(Math.random() * currentIndex);
    //     currentIndex--;

    //     // And swap it with the current element.
    //     temporaryValue = this.cards[currentIndex];
    //     this.cards[currentIndex] = cards[randomIndex];
    //     this.cards[randomIndex] = temporaryValue;
    //   }
    // },
    draw() {
      this.loading = true;
      this.pick_card = false;
      this.$http
        .post("api/play/" + this.user.id, {
          card: this.selected_card._id
        })
        .then(result => {
          console.log(JSON.stringify(result.data));
          if (result.data.message) {
            alert(result.data.message);
          }
          this.cancel();
          this.loadCards(() => {
            this.loading = false;
            this.startPolling();
          });
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
