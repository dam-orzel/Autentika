<template>
  <div class="loading" v-if="loaderActive"></div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("helpers", ["loaderActive"])
  }
};
</script>

<style></style>
