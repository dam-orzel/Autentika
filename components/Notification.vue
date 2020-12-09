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
