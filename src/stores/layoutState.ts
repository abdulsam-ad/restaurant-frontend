import { ref, watch } from "vue";

export const sidebarCollapsed = ref(false);

const saved = localStorage.getItem("sidebar-collapsed");
if (saved !== null) {
  sidebarCollapsed.value = saved === "true";
}

watch(sidebarCollapsed, (newVal) => {
  localStorage.setItem("sidebar-collapsed", String(newVal));
});

export function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}
