<template>
  <header class="topbar" :class="{ collapsed: sidebarCollapsed }">
    <div class="left-section">
      <h1 class="title">👨‍🍳 Owner Dashboard</h1>

      <!-- Restaurant Selector -->
      <div v-if="ownedRestaurants.length" class="restaurant-selector">
        <select v-model="selectedRestaurantId" @change="onRestaurantChange">
          <option
            v-for="restaurant in ownedRestaurants"
            :key="restaurant.id"
            :value="restaurant.id"
          >
            {{ restaurant.name }}
          </option>
        </select>
      </div>

    </div>

    <div class="profile-section" ref="dropdownRef">
      <div class="profile" @click="toggleDropdown">
        <img
          v-if="userStore.user?.profile?.image"
          :src="userStore.user.profile.image"
          alt="Avatar"
          class="avatar"
        />
        <div v-else class="avatar placeholder">👤</div>
        <span class="username">{{ userStore.user?.username || "Owner" }}</span>
      </div>

      <transition name="fade">
        <div v-if="showDropdown" class="dropdown-menu">
          <div class="dropdown-header">
            <strong>
              {{
                (userStore?.user?.profile?.first_name || '') +
                ' ' +
                (userStore?.user?.profile?.last_name || '')
              }}
            </strong>
            <small> Restaurant Owner</small>
          </div>
          <RouterLink to="/owner/profile" class="dropdown-item">⚙️ Settings</RouterLink>
          <button class="dropdown-item" @click="logout">🚪 Logout</button>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user.ts";
import { useToast } from "vue-toastification";
import { sidebarCollapsed } from "../../stores/layoutState.ts";
import {
  loadRestaurants,
  ownedRestaurants,
  selectedRestaurantId,
} from "../../stores/restaurantState";


const router = useRouter();
const toast = useToast();
const userStore = useUserStore();

const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    showDropdown.value = false;
  }
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

async function logout() {
  showDropdown.value = false;
  try {
    await userStore.logout();
    await router.push("/login");
  } catch (err) {
    console.error(err);
    toast.error("Failed to logout.");
  }
}

function onRestaurantChange() {
  window.dispatchEvent(new CustomEvent("restaurant-changed", { detail: selectedRestaurantId.value }));
  toast.success("Restaurant switched successfully!");
}

onMounted(async () => {
  await userStore.loadUser()
  await loadRestaurants();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.topbar {
  height: 60px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
  transition: margin-left 0.3s ease-in-out;
}

/* Expanded sidebar */
.layout:not(.collapsed) .topbar {
  margin-left: 220px;
}

/* Collapsed sidebar */
.layout.collapsed .topbar {
  margin-left: 45px;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.profile-section {
  position: relative;
}

.profile {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
}

.avatar.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  color: #94a3b8;
  font-size: 20px;
}

.username {
  font-weight: 600;
  color: #1f2937;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 55px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  overflow: hidden;
  z-index: 999;
}

.dropdown-header {
  padding: 12px;
  border-bottom: 1px solid #eee;
  background: #f9fafb;
}

.dropdown-item {
  display: block;
  padding: 10px 14px;
  text-decoration: none;
  color: #1f2937;
  font-weight: 500;
  transition: background 0.2s ease;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.restaurant-selector select {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f9fafb;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.restaurant-selector select:hover {
  background: #eef2ff;
}
</style>
