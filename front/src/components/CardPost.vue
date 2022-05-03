<template>
  <div class="post-form">
    <p>{{ user.username }}</p>
    <textarea v-model="content" id="message" placeholder="Quoi de neuf ?" />
    <div class="send">
      <button class="btn-send" @click="sendMessage()">Envoyer</button>
    </div>
    <p class="error" v-if="error">Merci de saisir un message.</p>
  </div>
</template>   



<script>
import { mapState } from "vuex";

export default {
  data: function () {
    return {
      content: "",
      error: false,
    };
  },
  mounted: function () {
    this.$store.dispatch("getUserInfos");
  },
  computed: {
    ...mapState({ user: "userInfos" }),
    ...mapState(["status"]),
  },
  methods: {
    sendMessage: function () {
      this.$store
        .dispatch("sendMessage", {
          content: this.content,
        })
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          this.error = true;
        });
    },
  },
};
</script>

<style>
.post-form {
  margin: 20px 0;
  padding: 16px 40px;
  border-radius: 20px;
  position: relative;
  background: #3b3363;
  border: 4px solid #3b3363;
}

.post-form p {
  font-size: 20px;
  color: white;
  margin-bottom: 15px;
}

textarea {
  height: 70px;
  width: 100%;
  font-size: 20px;
  padding: 12px 15px;
  border-radius: 20px 20px 6px 20px;
  background-color: #2c254a;
  border-color: #3b3363;
  color: white;
}

textarea::placeholder {
  color: white;
}

.send {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}

.btn-send {
  width: 190px;
  padding: 10px 20px;
  color: white;
  background: #eb8153;
  border-radius: 20px;
  border: none;
  font-size: 15px;
  font-weight: bold;
}
</style>