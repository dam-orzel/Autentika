<template>
  <div
    class="notification"
    :class="{
      error: Notification_statusGet == 'error',
      success: Notification_statusGet == 'success',
      active: Notification_isActiveGet
    }"
  >
    <span>{{ Notification_textGet }}</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("helpers", [
      "Notification_statusGet",
      "Notification_isActiveGet",
      "Notification_textGet"
    ])
  }
};
</script>

<style lang="scss">
.notification {
  position: fixed;
  bottom: 10px;
  right: -450px;
  padding: 10px 60px;
  border-radius: 5px;
  color: white;
  font-weight: 500;
  transition: 0.5s ease-in-out;
  font-size: 13px;
  &.active {
    right: 10px;
  }
  &.error {
    background: crimson;
  }
  &.success {
    background: green;
  }
}
</style>
