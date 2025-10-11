<template>
  <aside :class="['sidebar', { collapsed: sidebarCollapsed }]">
    <div class="sidebar-header">
      <span class="logo-text" v-if="!sidebarCollapsed">👤 Super Admin</span>
      <span v-else>👤</span>
    </div>

    <nav class="menu">
        <RouterLink to="/super" class="menu-item" exact-active-class="active">
          <span class="icon">🏠</span>
          <span v-if="!sidebarCollapsed" class="label">Overview</span>
        </RouterLink>
        <RouterLink to="/super/users" class="menu-item" exact-active-class="active">
          <span class="icon">👤</span>
          <span v-if="!sidebarCollapsed" class="label">Users</span>
        </RouterLink>
        <RouterLink to="/super/restaurants" class="menu-item" exact-active-class="active">
          <span class="icon">🍽️</span>
          <span v-if="!sidebarCollapsed" class="label">Restaurants</span>
        </RouterLink>
    </nav>

    <button class="collapse-btn" @click="toggleSidebar">
      {{ sidebarCollapsed ? '➡' : '⬅' }}
    </button>
  </aside>
</template>

<script setup lang="ts">
import { sidebarCollapsed, toggleSidebar } from "../../stores/layoutState";
</script>

<style scoped>

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 220px;
  background: #1e293b;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  transition: width 0.3s ease-in-out;
  z-index: 50;
}

.sidebar.collapsed {
  width: 45px;
}

.sidebar-header {
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  margin: 1rem 0 2rem 0;
}

.menu {
  flex: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.7rem;
  margin: 0.3rem 0;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 0.4rem;
  transition: background 0.2s;
}

.menu-item:hover,
.menu-item.active {
  background: #334155;
  color: white;
}

.icon {
  width: 25px;
  text-align: center;
}

.label {
  margin-left: 0.5rem;
  font-size: 0.95rem;
}

.collapse-btn {
  background: #334155;
  color: #fff;
  border: none;
  padding: 0.4rem;
  border-radius: 0.4rem;
  margin-top: auto;
  cursor: pointer;
}

.collapse-btn:hover {
  background: #475569;
}
</style>
