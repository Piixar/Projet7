<template>
  <div class="container">
    <div class="card-main">
      <div class="card-post">
        <CardPost></CardPost>
      </div>

      <!-- Section message -->

      <ul>
        <li class="card-container" v-for="message of posts" :key="message.id">
          <div class="card-header">
            <p>{{ message.User.username }}</p>
            <span>Écrit le : {{ createdAt(message.createdAt) }}</span>
          </div>
          <div class="card-content">
            <textarea
              v-model="message.content"
              class="post-form"
              v-if="update[message.id]"
            />
            <button
              class="btn-send displayBtn"
              v-if="
                (user.id == message.UserId || user.isAdmin) &&
                update[message.id]
              "
              @click="updateMessage(message.id, message.content)"
            >
              Modifier
            </button>
            <p v-else>{{ message.content }}</p>
          </div>
          <div class="card-footer">
            <div class="comment-icon">
              <font-awesome-icon
                @click="showComments(message.id)"
                class="icon"
                icon="comment-alt"
              />
              <span class="comment-length">{{ message.Comments.length }}</span>
            </div>
            <div class="del-upd-icon">
              <font-awesome-icon
                v-if="user.id == message.UserId || user.isAdmin"
                @click="openMessage(message.id)"
                class="update icon"
                icon="pen-alt"
              />
              <font-awesome-icon
                v-if="user.id == message.UserId || user.isAdmin"
                class="deleteButton icon"
                @click="deleteMessage(message.id)"
                icon="trash-alt"
              />
            </div>
          </div>

          <!-- Section Commentaire -->

          <div v-if="toggle[message.id]">
            <div v-for="comment of comments" :key="comment.id">
              <comment :id="comment.id"></comment>
              <ul
                class="comment-post card-post"
                v-if="comment.messageId == message.id"
              >
                <li class="card-container">
                  <div>
                    <div class="card-header">
                      <p>{{ comment.User.username }}</p>
                      <span>Écrit le : {{ createdAt(comment.createdAt) }}</span>
                    </div>
                    <div class="card-content">
                      <textarea
                        v-model="comment.comment"
                        class="post-form"
                        v-if="majComment[comment.id]"
                      />
                      <button
                        class="btn-send displayBtn"
                        v-if="
                          (user.id == comment.UserId || user.isAdmin) &&
                          majComment[comment.id]
                        "
                        @click="updateComment(comment.id, comment.comment)"
                      >
                        Modifier
                      </button>

                      <p v-else>{{ comment.comment }}</p>
                    </div>
                    <div class="card-footer">
                      <div class="del-upd-icon">
                        <font-awesome-icon
                          v-if="user.id == comment.UserId || user.isAdmin"
                          @click="openComment(comment.id)"
                          class="update icon"
                          icon="pen-alt"
                        />
                        <font-awesome-icon
                          v-if="user.id == comment.UserId || user.isAdmin"
                          class="deleteButton icon"
                          @click="deleteComment(comment.id)"
                          icon="trash-alt"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="card-comment">
              <CardComment></CardComment>
            </div>
          </div>
        </li>
      </ul>

      <!-- Gestion erreurs -->

      <p class="error" v-if="errorDelete">
        Impossible de supprimer le message.
      </p>
      <p class="error" v-if="errorUpdate">
        Impossible de mettre à jour le message.
      </p>
      <p class="error" v-if="errorDeleteCom">
        Impossible de supprimer le commentaire.
      </p>
      <p class="error" v-if="errorUpdate">
        Impossible de mettre à jour le commentaire.
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CardPost from "../components/CardPost.vue";
import CardComment from "../components/CardComment.vue";

export default {
  name: "homeCtrl",
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getPosts");
    this.$store.dispatch("getUserInfos");
    this.$store.dispatch("getComments");
  },

  data() {
    return {
      errorDelete: false,
      errorUpdate: false,
      errorDeleteCom: false,
      errorUpdateCom: false,
      update: [],
      majComment: [],
      toggle: [],
      onGoingMessageId: 0,
    };
  },
  components: {
    CardPost: CardPost,
    CardComment: CardComment,
  },
  computed: {
    ...mapState(["posts"]),
    ...mapState({ user: "userInfos" }),
    ...mapState(["status"]),
    ...mapState(["comments"]),
  },
  methods: {
    showComments: function (messageId) {
      this.toggle[messageId] = !this.toggle[messageId];
      this.$store.state.onGoingMessageId = messageId;
    },

    createdAt: function (create) {
      return new Date(create).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
    },

    deleteMessage: function (id) {
      if (confirm("Êtes-vous sur de vouloir supprimer votre message ?")) {
        this.$store
          .dispatch("deleteMessage", {
            messageId: id,
          })
          .then(() => {
            window.location.reload();
          })
          .catch(() => {
            this.errorDelete = true;
          });
      }
    },
    deleteComment: function (id) {
      if (confirm("Êtes-vous sur de vouloir supprimer votre commentaire ?")) {
        this.$store
          .dispatch("deleteComment", {
            commentId: id,
          })
          .then(() => {
            window.location.reload();
          })
          .catch(() => {
            this.errorDeleteCom = true;
          });
      }
    },
    updateMessage: function (id, content) {
      this.$store
        .dispatch("updateMessage", {
          messageId: id,
          content: content,
        })
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          this.errorUpdate = true;
        });
    },
    updateComment: function (id, content) {
      this.$store
        .dispatch("updateComment", {
          commentId: id,
          comment: content,
        })
        .then(() => {
          window.location.reload();
        })
        .catch(() => {
          this.errorUpdateCom = true;
        });
    },
    openMessage: function (messageId) {
      this.update[messageId] = true;
    },
    openComment: function (commentId) {
      this.majComment[commentId] = true;
    },
  },
};
</script>

<style>
.container {
  min-width: 100%;
}

.card-main {
  width: 70%;
}

.card-container {
  border: 4px solid #3b3363;
  padding: 16px;
  border-radius: 20px;
  min-width: 100%;
  margin: 25px auto;
  min-height: 100px;
  font-size: 20px;
  color: white;
  list-style: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.card-content {
  margin: 15px 0 15px 0;
  display: flex;
  flex-wrap: wrap;
}

.displayBtn {
  margin-left: auto;
}
.del-upd-icon {
  margin-left: auto;
}

.comment-length {
  margin-left: 5px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
}

.update {
  margin-right: 15px;
}

.icon {
  cursor: pointer;
}

@media (max-width: 620px) {
  .card-main {
    width: 100%;
  }
  .card-container {
    font-size: 18px;
  }
  textarea {
    font-size: 16px;
  }
  .navbar {
    justify-content: none;
    flex-wrap: wrap;
    padding-left: 15px;
  }
  .navbar-nav {
    margin-bottom: 10px;
    width: 100%;
    justify-content: space-between;
  }
  .card-subtitle {
    padding: 10px 0;
  }
}
</style>

