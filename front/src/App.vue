<template>
  <div id="app">
    <nav class="navbar" v-if="userConnect">
      <div class="navbar-nav">
        <a href="/" class="navbar-logo">Groupomania</a>
        <li class="nav-item">
          <router-link to="/home" class="nav-link">
            <font-awesome-icon icon="home" /> Accueil
          </router-link>
        </li>
      </div>
      <div v-if="!userConnect" class="navbar-nav">
        <li class="nav-item">
          <router-link to="/" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Se connecter
          </router-link>
        </li>
      </div>
      <div v-if="userConnect" class="navbar-nav">
        <li class="nav-item">
          <router-link to="/profil" class="nav-link">
            <font-awesome-icon icon="user" />
            Bienvenue {{ user.username }}
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="logout()">
            <font-awesome-icon icon="sign-out-alt" /> Se déconnecter
          </a>
        </li>
      </div>
    </nav>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState({
      user: "userInfos",
    }),
    userConnect() {
      if (this.$store.state.user.userId != -1) {
        return true;
      } else return false;
    },
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/");
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  max-width: 100%;
}

body {
  background-color: #2c254a;
  padding: 32px;
}

.container {
  display: flex;
  justify-content: center;
}

section {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
}

.card {
  width: 540px;
  background: #3b3363;
  border-radius: 16px;
  padding: 32px;
  justify-content: center;
}

.card-title {
  text-align: center;
  font-weight: 800;
  color: #eb8153;
}

.card-subtitle {
  text-align: center;
  color: white;
  font-weight: 500;
}

.list-user {
  list-style: none;
  font-size: 20px;
  margin-bottom: 10px;
}

.list-user p {
  padding-bottom: 10px;
  color: white;
}

.button {
  background: #eb8153;
  color: white;
  border-radius: 8px;
  font-weight: 800;
  font-size: 15px;
  border: none;
  width: 100%;
  padding: 16px;
  transition: 0.4s background-color;
}

.card-action {
  color: #eb8153;
  text-decoration: underline;
}

.card-action:hover {
  cursor: pointer;
}

.button:hover {
  cursor: pointer;
  background: #eb8153;
}

.button-disabled {
  background: #cecece;
  color: #ececec;
}
.button-disabled:hover {
  cursor: not-allowed;
  background: #cecece;
}

.navbar {
  display: flex;
  justify-content: space-between;
  border-bottom: 3px solid white;
  padding-bottom: 20px;
}
.navbar li {
  list-style: none;
}

.navbar-nav {
  display: flex;
  font-size: 20px;
}
.navbar-nav li {
  margin-right: 20px;
}

.navbar-logo {
  margin-right: 20px;
  color: white;
}

a.nav-link {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

a.navbar-logo {
  text-decoration: none;
}

/* Media Queries */

@media (max-width: 620px) {
  body {
    padding: 0;
  }

  .card {
    width: 375px;
  }
}
</style>
