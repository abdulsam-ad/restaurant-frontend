<template>
  <div v-if="loading" class="loading-screen">
    <div class="spinner"></div>
    <p>🍳 Loading your menus...</p>
  </div>

  <div v-else class="menu-manager">
    <div class="header">
      <h2>📜 Your Menus</h2>
      <RouterLink
          :to="`/owner/menu-builder/`"
          class="btn-primary"
      >
        ➕ New Menu
      </RouterLink>
    </div>

    <transition name="fade">
      <div v-if="menus.length === 0" class="empty">
        <p>No menus found. Create your first one now 🍽️</p>
      </div>

      <div v-else class="menu-grid">
        <div
          v-for="menu in menus"
          :key="menu.id"
          class="menu-card"
        >
          <div class="menu-info">
            <h3>{{ menu.name }}</h3>
            <p>{{ menu.description || "No description yet." }}</p>
            <small>🍔 Items: {{ menu.menu_items?.length || 0 }}</small>
          </div>
          <div class="menu-actions">
            <RouterLink :to="`/owner/menu-detail/${menu.id}`" class="btn-primary">Items</RouterLink>
            <button class="btn btn-danger" @click.stop="confirmDelete(menu)">Delete</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Create/Edit Modal -->
    <transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h3>{{ editMode ? "✏️ Edit Menu" : "➕ Create New Menu" }}</h3>

          <div class="form-group">
            <label>Name</label>
            <input v-model="form.name" placeholder="Enter menu name" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" placeholder="Optional description..."></textarea>
          </div>

          <div class="actions">
            <button class="btn-primary" @click="saveMenu">
              {{ editMode ? "💾 Save" : "✅ Create" }}
            </button>
            <button class="btn-secondary" @click="closeModal">↩ Cancel</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Pagination -->
    <div v-if="nextPage || prevPage" class="pagination">
      <button class="btn-secondary" :disabled="!prevPage" @click="loadPage(prevPage, currentPage - 1)">
        ⬅️ Prev
      </button>
      <span class="page-info">📄 Page {{ currentPage }}</span>
      <button class="btn-secondary" :disabled="!nextPage" @click="loadPage(nextPage, currentPage + 1)">
        Next ➡️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useToast } from "vue-toastification";
import {
  fetchMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} from "../../../services/owner/menu.ts";
import { selectedRestaurantId } from "../../../stores/restaurantState.ts";

interface Menu {
  id: number;
  name: string;
  description?: string;
  menu_items?: [];
}

const menus = ref<Menu[]>([]);
const loading = ref(false);
const showModal = ref(false);
const editMode = ref(false);
const currentMenuId = ref<number | null>(null);

const form = ref({ name: "", description: "" });
const toast = useToast();

const nextPage = ref<string | null>(null);
const prevPage = ref<string | null>(null);
const currentPage = ref<number>(1);

async function loadMenus(url: string | null = null, page = 1) {
  if (!selectedRestaurantId.value) {
    toast.error("Please select a restaurant first.");
    menus.value = [];
    return;
  }

  try {
    loading.value = true;
    const data: any = url ? await fetchMenus(selectedRestaurantId.value, url) :
        await fetchMenus(selectedRestaurantId.value, `?page=${page}`);
    menus.value = data.results;
    nextPage.value = data.next;
    prevPage.value = data.previous;
    currentPage.value = page;
  } catch (err) {
    console.error(err);
    toast.error("Failed to load menus.");
  } finally {
    loading.value = false;
  }
}

async function saveMenu() {
  if (!form.value.name.trim()) {
    toast.error("Menu name is required!");
    return;
  }
  if (!selectedRestaurantId.value) {
    toast.error("Please select a restaurant first!");
    return;
  }

  try {
    if (editMode.value && currentMenuId.value) {
      await updateMenu(selectedRestaurantId.value, currentMenuId.value, form.value);
      toast.success("✅ Menu updated successfully!");
    } else {
      await createMenu({
        restaurant: selectedRestaurantId.value,
        name: form.value.name,
        description: form.value.description,
      });
      toast.success("🎉 Menu created successfully!");
    }
    await refreshMenus();
    closeModal();
  } catch (err) {
    console.error(err);
    toast.error("❌ Failed to save menu.");
  }
}

function confirmDelete(menu: Menu) {
  if (!selectedRestaurantId.value) {
    return
  }
  if (confirm(`Are you sure you want to delete "${menu.name}"?`)) {
    deleteMenu(selectedRestaurantId.value, menu.id)
      .then(async () => {
        toast.success("🗑️ Menu deleted successfully!");
        await loadMenus('', currentPage.value);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete menu.");
      });
  }
}

function closeModal() {
  showModal.value = false;
}

async function loadPage(url: string | null, page: number) {
  if (url) await loadMenus(url, page)
}

async  function refreshMenus() {
  await  loadMenus( `?page=${currentPage.value}`)
}

onMounted(async () => {
  if (selectedRestaurantId.value) {
    await loadMenus();
  }
  window.addEventListener("restaurant-changed", refreshMenus);
});

watch(selectedRestaurantId, async (newId) => {
  if (newId) await loadMenus();
});

onBeforeUnmount(() => {
  window.removeEventListener("restaurant-changed", refreshMenus);
});
</script>

<style scoped>
.menu-manager {
  padding: 25px;
  background: linear-gradient(145deg, #ffffff, #f3f4f6);
  border-radius: 16px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.menu-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  text-decoration: none;
  color: #111827;
  transition: all 0.3s ease;
  position: relative;
}

.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s ease;
}

.icon-btn:hover {
  transform: scale(1.2);
}

.icon-btn.edit {
  color: #2563eb;
}

.icon-btn.delete {
  color: #dc2626;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.modal {
  background: #ffffff;
  padding: 25px;
  border-radius: 12px;
  width: 360px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
}

input,
textarea {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 15px;
  transition: all 0.2s ease;
}

input:focus,
textarea:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.menu-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.25s ease;
}
.menu-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.15);
}

.menu-actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Buttons */
.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  min-width: 70px;
}

.btn-danger {
  background: linear-gradient(180deg,#ef4444,#dc2626);
  color:#fff;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  text-decoration: none;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1e40af, #2563eb);
  transform: scale(1.05);
}

.btn-secondary {
  background: #e5e7eb;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  border: none;
}

.btn-secondary:hover {
  background: #d1d5db;
  transform: scale(1.05);
}

.empty {
  text-align: center;
  padding: 50px;
  color: #6b7280;
  font-style: italic;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  color: #1e3a8a;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style>
