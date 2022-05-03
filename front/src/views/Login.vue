<template>
  <section>
    <div class="card">
      <h1 class="card-title" v-if="mode == 'login'">Connexion</h1>
      <h1 class="card-title" v-else>Inscription</h1>
      <p class="card-subtitle" v-if="mode == 'login'">
        Tu n'as pas encore de compte ?
        <span class="card-action" @click="switchToCreateAccount()"
          >Créer un compte</span
        >
      </p>
      <p class="card-subtitle" v-else>
        Tu as déjà un compte ?
        <span class="card-action" @click="switchToLogin()">Se connecter</span>
      </p>

      <div class="form-row">
        <input
          v-model="email"
          class="form-row-input"
          type="text"
          placeholder="Adresse mail"
        />
      </div>
      <div class="form-row" v-if="mode == 'create'">
        <input
          v-model="username"
          class="form-row-input"
          type="text"
          placeholder="Pseudo"
        />
      </div>
      <div class="form-row">
        <input
          v-model="password"
          class="form-row-input"
          type="password"
          placeholder="Mot de passe"
          autocomplete="off"
        />
      </div>
      <div class="form-row" v-if="mode == 'login' && status == 'error_login'">
        Adresse mail et/ou mot de passe invalide.
      </div>
      <div class="form-row" v-if="mode == 'create' && status == 'error_create'">
        Création impossible merci de vérifier la cohérance de vos informations.
      </div>
      <div class="form-row">
        <button
          @click="login()"
          class="button"
          :class="{ 'button-disabled': !validatedFields }"
          v-if="mode == 'login'"
        >
          <span v-if="status == 'loading'">Connexion en cours ...</span>
          <span v-else>Connexion</span>
        </button>
        <button
          @click="createAccount()"
          class="button"
          :class="{ 'button-disabled': !validatedFields }"
          v-else
        >
          <span v-if="status == 'loading'">Création en cours ...</span>
          <span v-else>Créer mon compte</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "loginCtrl",
  data: function () {
    return {
      mode: "login",
      email: "",
      username: "",
      password: "",
    };
  },
  mounted: function () {
    if (this.$store.state.user.userId !== -1) {
      this.$router.push("/profil");
      return;
    }
  },
  computed: {
    validatedFields: function () {
      if (this.mode == "create") {
        return this.email != "" && this.username != "" && this.password != "";
      } else {
        return this.email != "" && this.password != "";
      }
    },
    ...mapState(["status"]),
  },
  methods: {
    switchToCreateAccount: function () {
      this.mode = "create";
    },
    switchToLogin: function () {
      this.mode = "login";
    },
    login: function () {
      const self = this;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then(function () {
          self.$router.push("/home");
        }),
        function (err) {
          console.log(err);
        };
    },
    createAccount: function () {
      const self = this;
      this.$store
        .dispatch("createAccount", {
          email: this.email,
          username: this.username,
          password: this.password,
        })
        .then(function () {
          self.login();
        }),
        function (err) {
          console.log(err);
        };
    },
  },
};
</script>

<style scoped>
.form-row {
  display: flex;
  margin: 16px 0px;
  gap: 16px;
  flex-wrap: wrap;
  color: white;
}

.form-row-input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #2c254a;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  min-width: 100px;
  color: white;
}

.form-row-input::placeholder {
  color: white;
}
</style>>
