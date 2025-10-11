<template>
  <div class="notifications-page">
    <h2>🔔 Notifications</h2>

    <div v-if="loading" class="loading">Loading notifications...</div>

    <div v-else-if="notifications.length === 0" class="empty">
      No notifications yet 🎉
    </div>

    <ul v-else class="notification-list">
      <li
        v-for="(notif, index) in notifications"
        :key="index"
        :class="['notification-item', { unread: !notif.read }]"
        @click="markAsRead(notif.id)"
      >
        <div class="message">{{ notif.message }}</div>
        <div class="time">
          {{ new Date(notif.created_at).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short"
          }) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { fetchMyNotifications, markNotificationRead } from "../../services/notifications.ts";

const notifications = ref<any[]>([]);
const loading = ref(true);
const toast = useToast();


async function fetchNotifications() {
  loading.value = true;
  try {
    // Example static list for now:
    notifications.value = await fetchMyNotifications();
  } catch (err) {
    console.error(err);
    toast.error("Failed to load notifications.");
  } finally {
    loading.value = false;
  }
}

async function markAsRead(id: number) {
  try {
    await markNotificationRead(id);
    const notif = notifications.value.find(n => n.id === id);
    if (notif) notif.read = true;
  } catch (err) {
    toast.error("Failed to mark as read.");
  }
}

onMounted(fetchNotifications);
</script>

<style scoped>
.notifications-page {
  max-width: 600px;
  margin: 2rem auto;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.notification-list {
  list-style: none;
  padding: 0;
}
.notification-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}
.notification-item.unread {
  background-color: #f0f9ff;
}
.message {
  font-weight: 500;
}
.time {
  font-size: 0.85rem;
  color: #6b7280;
}
.empty {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
}
.loading {
  text-align: center;
  color: #2563eb;
}
</style>
