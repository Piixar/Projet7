<template>
  <section>
    <div class="card">
      <h1 class="card-title">Espace Perso</h1>
      <p class="card-subtitle">Voilà donc qui je suis...</p>
      <div class="list-user">
        <p>Pseudo : {{ user.username }}</p>
        <p>Mail : {{ user.email }}</p>
        <div class="userBio">
          <p>Bio : {{ user.bio }}</p>
          <font-awesome-icon @click="openBio()" class="icon" icon="pen-alt" />
        </div>
        <div class="form-profil">
          <div v-if="changeBio">
            <textarea
              v-model="bio"
              class="post-form"
              placeholder="Dites-nous en plus !"
            />
            <div class="displayBtn">
              <button class="btn-send" @click="updateUserInfos()">
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row">
        <button @click="logout()" class="button">Déconnexion</button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "profileCtrl",

  mounted: function () {
    console.log(this.$store.state.user);
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getUserInfos");
  },
  data() {
    return {
      bio: "",
      changeBio: false,
    };
  },
  computed: {
    ...mapState({
      user: "userInfos",
    }),
  },
  methods: {
    logout: function () {
      this.$store.commit("logout");
      this.$router.push("/");
    },
    updateUserInfos: function () {
      this.$store
        .dispatch("updateUserInfos", {
          bio: this.bio,
        })
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          this.errorUpdate = true;
        });
    },
    openBio: function () {
      this.changeBio = true;
    },
  },
};
</script>

<style scoped >
.userBio {
  display: flex;
  justify-content: space-between;
}

.icon {
  color: white;
}

.post-form {
  border: 4px solid #2c254a;
  font-size: 18px;
}

.displayBtn {
  text-align: right;
}
.btn-send {
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
