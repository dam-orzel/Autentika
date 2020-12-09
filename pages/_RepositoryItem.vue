<template>
  <section class="repository wrapper">
    <h2 class="repository__name">{{ repositoryGetter.name }}</h2>
    <span class="repository__description">{{
      repositoryGetter.description
    }}</span>
    <div class="repository__community">
      <div class="community__stars">
        <i class="fas fa-star"></i>
        <span>{{ repositoryGetter.stargazers.totalCount }}</span>
      </div>
      <div class="community__forks">
        <i class="fas fa-code-branch"></i>
        <span>{{ repositoryGetter.forks.totalCount }}</span>
      </div>
      <div class="community__watchers">
        <i class="far fa-eye"></i>
        <span>{{ repositoryGetter.watchers.totalCount }}</span>
      </div>
    </div>
    <div class="repository__clone">
      <div class="clone__https">
        <button class="btn copy" @click="copyLink">Skopiuj HTTPS</button>
      </div>
    </div>
    <nuxt-link to="/" class="btn previous">Strona główna</nuxt-link>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("repositoryItem", ["repositoryGetter"])
  },
  methods: {
    async copyLink() {
      await navigator.clipboard.writeText(this.repositoryGetter.url);
      this.$store.commit("helpers/Notification_status", "success");
      this.$store.commit("helpers/Notification_isActive", true);
      this.$store.commit(
        "helpers/Notification_text",
        `Skopiowano ${this.repositoryGetter.url}`
      );
      setTimeout(() => {
        this.$store.commit("helpers/Notification_isActive", false);
        this.$store.commit("helpers/Notification_status", "");
      }, 3000);
    }
  }
};
</script>

<style lang="scss">
section.repository {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .repository__name {
    font-size: 50px;
    margin: 0;
  }
  .repository__description {
    color: $gray;
  }
  .repository__community {
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 30px;
    .community__stars,
    .community__forks,
    .community__watchers {
      display: flex;
      flex-direction: column;
      align-items: center;
      .fas,
      .far {
        font-size: 24px;
        margin-bottom: 10px;
      }
      .fa-star {
        color: $gold;
      }
      .fa-code-branch {
        color: $purple;
      }
      .fa-eye {
        color: $blue;
      }
      span {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
  .repository__clone {
    .clone__https {
      display: flex;
      flex-direction: column;
    }
  }
  .btn {
    background: $blue;
    padding: 5px 30px;
    border-radius: 5px;
    text-transform: uppercase;
    text-decoration: none;
    color: $white;
    font-size: 12px;
    font-weight: 500;
    transition: $transition-time;
    border: 0;
    cursor: pointer;
    &.previous {
      position: absolute;
      top: 10px;
      left: 10px;
    }
    &.copy {
      padding: 5px 30px;
      width: fit-content;
      margin-top: 50px;
    }
    &:hover {
      background: $blue--dark;
    }
    &:active {
      background: shade($blue--dark, 30%);
    }
  }
}
</style>
