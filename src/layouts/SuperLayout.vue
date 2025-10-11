<template>
  <div class="layout" :class="{ collapsed: sidebarCollapsed }">
    <SuperSidebar />
    <div class="main-section">
      <SuperTopbar />
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sidebarCollapsed } from "../stores/layoutState";
import SuperSidebar from "../components/super/SuperSidebar.vue";
import SuperTopbar from "../components/super/SuperTopbar.vue";
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  transition: all 0.3s ease-in-out;
}
.main-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
}
.content {
  padding: 2rem;
  background-color: #f9f9fb;
  flex-grow: 1;
  transition: all 0.3s ease-in-out;
}

/* Sidebar expanded */
.layout:not(.collapsed) .content {
  margin-left: 220px;
}

/* Sidebar collapsed */
.layout.collapsed .content {
  margin-left: 70px;
}
</style>
