<template>
    <v-layout row wrap>
      <v-spacer></v-spacer>
      <v-flex xs4>
      <v-card>
        <v-card-title class="display-2">
            Login As: 
        </v-card-title>
        <v-card-text>
            <v-text-field label="User" v-model="user"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn color="success" @click="login">Login</v-btn>
        </v-card-actions>
      </v-card>
      </v-flex>
      <v-spacer></v-spacer>
    </v-layout>
</template>

<script>
export default {
  data: () => ({
    user: ""
  }),
  methods: {
    login() {
      this.$http
        .get("api/users/" + this.user)
        .then(result => {
          this.$store.commit("LOGIN", result.data);
          this.$router.push("/match");
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
    }
  }
};
</script>

<style>
</style>
