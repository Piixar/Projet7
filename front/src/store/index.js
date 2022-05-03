import { createStore } from 'vuex'

const axios = require('axios');

const userInstance = axios.create({baseURL: 'http://localhost:3000/api/auth/'})
const postInstance = axios.create({baseURL: 'http://localhost:3000/api/messages/'})
const commentInstance = axios.create({baseURL: 'http://localhost:3000/api/comments/'})

let user = localStorage.getItem('user');
if (!user) {
  user = {
    userId: -1,
    token: '',
  };
} else {
  try {
    user = JSON.parse(user);
    userInstance.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    postInstance.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    commentInstance.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
  } catch (ex) {
    user = {
      userId: -1,
      token: '',
    }
  }
}

export default createStore({
  state: {
    status: '',

    user: user,

    userInfos : {
      username: '',
      email: '',
      bio: '',
      isAdmin: false,
    },

    posts : [],

    comments : [],

    deleteInfos : {
      messageId: 0
    },

    sendComment: {
      comment: "",
      messageId: 0
    },

    deleteComment : {
      commentId: 0
    },
    message : {
      content: '',
      error: '',
    },

    updateUserInfos: {
      bio:''
    },

    updateInfos : {
      messageId: 0,
      content: ''
    },
    updateComment : {
      commentId: 0,
      comment: ''
    },

    onGoingMessageId: 0,

  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, user) {
      userInstance.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
      postInstance.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
      commentInstance.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    logout: function(state) {
      state.user = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('user');
    },
    userInfos: function (state, userInfos) {
      state.userInfos = userInfos;
    },
    sendMessage: function (state, message) {
      state.message = message;
    },
    sendComment: function (state, sendComment) {
      state.sendComment = sendComment;
    },
    deleteInfos: function (state, deleteInfos) {
      state.deleteInfos = deleteInfos;
    },
    updateUserInfos: function (state, updateUserInfos) {
      state.updateUserInfos = updateUserInfos
    },
    updateInfos: function (state, updateInfos) {
      state.updateInfos = updateInfos
    },
    updateComment: function (state, updateComments) {
      state.updateComments = updateComments;
    },
    deleteComment: function (state, deleteComments) {
      state.deleteComments = deleteComments;
    },
    setPosts : function(state, posts) {
      state.posts = posts;
    },
    setComments : function(state, comments) {
      state.comments = comments;
    },
  },
  actions: {

    // UserAction

    login:({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        userInstance.post('/login', userInfos)
        .then(function (res) {
          if(res.data.error) {
            alert(res.data.error);
          }
          commit('setStatus', '');
          commit('logUser', res.data );
          resolve(res);
        })
        .catch(function (err) {
          commit('setStatus', 'error_login');
          reject(err);
        });
      })
    },
    createAccount:({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        userInstance.post('/signup', userInfos)
        .then(function (res) {
          if(res.data.error) {
            alert(res.data.error);
          }
          commit('setStatus', 'created');
          resolve(res);
        })
        .catch(function (err) {
          commit('setStatus', 'error_create');
          reject(err);
        });
      })
    },
    getUserInfos: ({commit}) => {
      return new Promise((resolve, reject) => {
      userInstance.get('/profil')
      .then(function (res) {
        if(res.data.error) {
          alert(res.data.error);
        }
        commit('userInfos', res.data);
        resolve(res);
      })
      .catch(function (err) {
        reject(err);
      });
    })
    },

    updateUserInfos: ({commit},updateUserInfos) => {
      return new Promise((resolve, reject) => {
      userInstance.put('/profil' ,updateUserInfos)
      .then(function (res) {
        if(res.data.error) {
          alert(res.data.error);
        }
        commit('setStatus', res.data);
        resolve(res);
      }).catch(function (err) {
        commit('setStatus', err);
        reject(err);
      })
    });
  },

    // PostAction

    getPosts: ({commit}) => {
      return new Promise((resolve, reject) => {
      postInstance.get('/list')
      .then(function (res) {
        if(res.data.error) {
          alert(res.data.error);
        }
        commit('setPosts', res.data);
        resolve(res)
      }) 
      .catch(function (err) {
        reject(err)
      });
    });
    },

    sendMessage: ({commit},message) => {
      return new Promise((resolve, reject) => {
      postInstance.post('/new', message)
      .then(function (res) {
        if(res.data.error) {
          alert(res.data.error);
        }
        commit('setStatus', res.data);
        resolve(res);
      }).catch(function (err) {
        commit('setStatus', err);
        reject(err);
      });
    });
    },

    deleteMessage: ({commit},deleteInfos) => {
      console.log(deleteInfos);
      return new Promise((resolve, reject) => {
      postInstance.delete('/' + deleteInfos.messageId)
      .then(function (res) {
        if(res.data.error) {
          alert(res.data.error);
        }
        commit('setStatus', res.data);
        resolve(res);
      }).catch(function (err) {
        commit('setStatus', err);
        reject(err);
      })
    });
    },
    updateMessage: ({commit},updateInfos) => {
      return new Promise((resolve, reject) => {
      postInstance.put('/' + updateInfos.messageId,updateInfos)
      .then(function (res) {
        if(res.data.error) {
          alert(res.data.error);
        }
        commit('setStatus', res.data);
        resolve(res);
      }).catch(function (err) {
        commit('setStatus', err);
        reject(err);
      })
    });
  },


  // CommentAction

  getComments: ({commit},) => {
    return new Promise((resolve, reject) => {
    commentInstance.get('/list/comment', )
    .then(function (res) {
      if(res.data.error) {
        alert(res.data.error);
      }
      commit('setComments', res.data);
      resolve(res)
    }) 
    .catch(function (err) {
      reject(err)
    });
  });
  },

  sendComment: ({commit},sendComment) => {
    return new Promise((resolve, reject) => {
    commentInstance.post('/new', sendComment)
    .then(function (res) {
      if(res.data.error) {
        alert(res.data.error);
      }
      commit('setStatus', res.data);
      resolve(res);
    }).catch(function (err) {
      commit('setStatus', err);
      reject(err);
    });
  });
  },

  updateComment: ({commit},updateComments) => {
    return new Promise((resolve, reject) => {
    commentInstance.put('/' + updateComments.commentId,updateComments)
    .then(function (res) {
      if(res.data.error) {
        alert(res.data.error);
      }
      commit('setStatus', res.data);
      resolve(res);
    }).catch(function (err) {
      commit('setStatus', err);
      reject(err);
    })
  });
},


deleteComment: ({commit},deleteComments) => {
  return new Promise((resolve, reject) => {
  commentInstance.delete('/' + deleteComments.commentId)
  .then(function (res) {
    if(res.data.error) {
      alert(res.data.error);
    }
    commit('setStatus', res.data);
    resolve(res);
  }).catch(function (err) {
    commit('setStatus', err);
    reject(err);
  })
});
},

}
})