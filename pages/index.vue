<template>
  <div>
    <header>
      <div class="header__search">
        <div class="input__container">
          <input
            class="search__input"
            type="text"
            v-model="inputSearch"
            @keyup.enter="clearSteps()"
            :disabled="!getterAccessToken"
            placeholder="Przeszukaj Github..."
          />
          <i class="fas fa-search" @click="clearSteps()"></i>
        </div>
        <a
          class="search__login"
          href="https://github.com/login/oauth/authorize?client_id=f408ca531d7cf6bbdbb5&redirect_uri=http://localhost:3000/oauth-callback"
          v-if="!getterAccessToken"
          >Zaloguj się</a
        >
      </div>
    </header>
    <main class="wrapper">
      <section class="repositories__container">
        <div
          class="repositories__item"
          v-for="repository in repositoriesList"
          :key="repository.id"
        >
          <h3 class="item__name">{{ repository.name }}</h3>
          <a class="item__url" :href="repository.url" target="_blank"
            >Go to {{ repository.name }} on Github!</a
          >
          <span class="item__desc">{{ repository.description }}</span>
          <div class="item__socials">
            <div class="socials__stars">
              <i class="fas fa-star"></i>
              <span>{{ repository.stargazers.totalCount }}</span>
            </div>
            <div class="socials__forks">
              <i class="fas fa-code-branch"></i>
              <span>{{ repository.forks.totalCount }}</span>
            </div>
          </div>
        </div>
      </section>
      <button
        class="repositories__more"
        @click="addMore"
        v-if="activeMoreButton"
      >
        Załaduj więcej
      </button>
    </main>
  </div>
</template>

<script>
import axios from "axios";

import { mapGetters } from "vuex";
export default {
  data() {
    return {
      repositoriesList: [],
      inputSearch: "",
      searchSteps: 10,
      activeMoreButton: false,
      noMatches: false
    };
  },
  methods: {
    searchRepos() {
      let data = {
        query: `
            query($searchString:String!, $after:String, $first:Int!) {
                search(query: $searchString, type: REPOSITORY, first: $first, after: $after) {
                    repositoryCount
                    nodes {
                        ... on Repository {
                            id
                            name
                            url
                            description
                            stargazers {
                              totalCount
                            }
                            forks {
                              totalCount
                            }
                        }
                    }
                }
            }
            `,
        variables: {
          searchString: this.inputSearch,
          after: null,
          first: this.searchSteps
        }
      };

      axios
        .post(
          "https://cors-anywhere.herokuapp.com/https://api.github.com/graphql",
          data,
          { headers: { Authorization: `Bearer ${this.getterAccessToken}` } }
        )
        .then(response => {
          if (response.data.data.search.nodes.length === 0) {
            this.noMatches = true;
            this.activeMoreButton = false;
            this.repositoriesList = [];
            this.$store.commit("helpers/Notification_status", "error");
            this.$store.commit("helpers/Notification_isActive", true);
            this.$store.commit(
              "helpers/Notification_text",
              "Brak pasujących wyników, spróbuj ponownie!"
            );
            setTimeout(() => {
              this.$store.commit("helpers/Notification_isActive", false);
              this.$store.commit("helpers/Notification_status", "");
            }, 3000);
          } else {
            this.repositoriesList = response.data.data.search.nodes;
            this.activeMoreButton = true;
            this.noMatches = false;
            this.$store.commit("helpers/Notification_status", "success");
            this.$store.commit("helpers/Notification_isActive", true);
            this.$store.commit(
              "helpers/Notification_text",
              `Poprawnie znaleziono wyniki dla ${this.inputSearch}`
            );
            setTimeout(() => {
              this.$store.commit("helpers/Notification_isActive", false);
              this.$store.commit("helpers/Notification_status", "");
            }, 3000);
          }
        })
        .finally(() => this.$store.commit("helpers/activateLoader", false));
    },
    addMore() {
      this.searchSteps += 4;
      this.searchRepos();
    },
    clearSteps() {
      this.searchSteps = 10;
      this.searchRepos();
      this.$store.commit("helpers/activateLoader", true);
    }
  },
  computed: {
    ...mapGetters("access", ["getterAccessToken"])
  }
};
</script>

<style lang="scss">
header {
  height: 20vh;
  .header__search {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: #4568dc;
    background: linear-gradient(to right, #b06ab3, #4568dc);

    .input__container {
      position: relative;
      .search__input {
        border: none;
        padding: 8px 30px 8px 15px;
        border-radius: 5px;
        min-width: 350px;
      }
      .fa-search {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        cursor: pointer;
        padding: 8px 8px;
        color: #4568dc;
      }
    }
    .search__login {
      text-decoration: none;
      text-transform: uppercase;
      color: white;
      background: black;
      padding: 8px 20px;
      border-radius: 5px;
      margin-top: 10px;
      font-size: 12px;
      font-weight: 600;
    }
  }
}
main {
  padding-bottom: 50px;
  .repositories__container {
    display: flex;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    margin: 50px 0;
    .repositories__item {
      border: 1px solid rgb(218, 218, 218);
      border-radius: 5px;
      padding: 10px 20px;
      margin: 10px;
      width: 40%;
      cursor: pointer;
      .item__name {
        // display: inline;
      }
      .item__url {
        text-decoration: none;
        font-size: 12px;
        font-weight: 600;
        color: #7b7bff;
        transition: 0.3s;
        &:hover {
          color: #5757e0;
        }
      }
      .item__desc {
        display: block;
        margin-top: 10px;
        height: 50px;
        font-size: 14px;
      }
      .item__socials {
        width: 100%;
        display: flex;
        justify-content: space-around;
        .socials__stars,
        .socials__forks {
          display: flex;
          flex-direction: column;
          align-items: center;
          .fas {
            font-size: 24px;
            margin-bottom: 10px;
          }
          .fa-star {
            color: gold;
          }
          .fa-code-branch {
            color: mediumpurple;
          }
          span {
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
  }
  .repositories__more {
    margin: 0 auto;
    display: block;
    width: 30vw;
    height: 40px;
    border: none;
    background: #4568dc;
    border-radius: 5px;
    text-transform: uppercase;
    font-weight: 600;
    color: white;
    cursor: pointer;
    margin-top: 20px;
    transition: 0.3s;
    &:hover {
      background: #4e73ec;
    }
    &:active {
      background: #819eff;
    }
  }
}
</style>
