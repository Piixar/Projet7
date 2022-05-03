<template>
  <div class="post-form">
    <p>{{ user.username }}</p>
    <textarea
      v-model="comment"
      id="commentaire"
      placeholder="Qu'en pensez-vous ?"
    />
    <div class="send">
      <button class="btn-send" @click="sendComment()">Envoyer</button>
    </div>
    <p class="error" v-if="error">Merci de saisir un commentaire.</p>
  </div>
</template>   



<script>
import { mapState } from "vuex";

export default {
  data: function () {
    return {
      comment: "",
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
    sendComment: function () {
      this.$store
        .dispatch("sendComment", {
          comment: this.comment,
          messageId: this.$store.state.onGoingMessageId,
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
</style>