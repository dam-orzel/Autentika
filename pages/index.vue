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
          @click="takeInfoFromRepo(repository)"
        >
          <h3 class="item__name">{{ repository.name }}</h3>
          <a class="item__url" :href="repository.url" target="_blank"
            >Go to {{ repository.name }} on Github!</a
          >
          <span class="item__desc">{{ repository.description }}</span>
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
                            watchers {
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
              "Brak pasujących wyników!"
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
      this.$store.commit("helpers/activateLoader", true);
    },
    clearSteps() {
      this.searchSteps = 10;
      this.searchRepos();
      this.$store.commit("helpers/activateLoader", true);
    },
    takeInfoFromRepo(repo) {
      this.$store.commit("repositoryItem/repositoryAccess", repo);
      this.$store.commit("helpers/activateLoader", false);
      this.$router.push({
        path: `/${repo.id}`,
        component: require("./_RepositoryItem.vue")
      });
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
    background: $blue;
    background: linear-gradient(to right, $purple, $blue);

    .input__container {
      position: relative;
      .search__input {
        border: none;
        background: $white;
        padding: 8px 30px 8px 15px;
        border-radius: 5px;
        min-width: 350px;
        font-weight: 500;
      }
      .fa-search {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        cursor: pointer;
        padding: 8px 8px;
        color: $blue;
        transition: $transition-time;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        &:hover {
          color: $blue--dark;
        }
        &:active {
          background: $gray--light;
        }
      }
    }
    .search__login {
      text-decoration: none;
      text-transform: uppercase;
      color: $white;
      background: $black;
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
      border: 1px solid $border__primary;
      border-radius: 5px;
      padding: 10px 20px;
      margin: 10px;
      width: 40%;
      cursor: pointer;
      transition: $transition-time;
      &:hover {
        border-color: $border__primary--dark;
        background: $gray--light;
      }
      .item__url {
        text-decoration: none;
        font-size: 12px;
        font-weight: 600;
        color: $blue;
        transition: $transition-time;
        &:hover {
          color: $blue--dark;
        }
      }
      .item__desc {
        display: block;
        margin-top: 10px;
        height: 50px;
        font-size: 14px;
      }
    }
  }
  .repositories__more {
    margin: 0 auto;
    display: block;
    width: 30vw;
    height: 40px;
    border: none;
    background: $blue;
    border-radius: 5px;
    text-transform: uppercase;
    font-weight: 600;
    color: $white;
    cursor: pointer;
    margin-top: 20px;
    transition: $transition-time;
    &:hover {
      background: $blue--dark;
    }
    &:active {
      background: shade($blue--dark, 30%);
    }
  }
}
</style>
