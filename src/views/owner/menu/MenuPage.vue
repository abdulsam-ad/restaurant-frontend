<template>
  <div class="menu-manager">
    <div class="header">
      <h2>📜 Menus</h2>
      <button class="btn" @click="openCreateModal">+ Create Menu</button>
    </div>

    <div v-if="loading" class="loading">Loading menus...</div>

    <div v-else-if="menus.length === 0" class="empty">
      <p>No menus found. Create your first menu!</p>
    </div>

    <div v-else class="menu-grid">
      <RouterLink v-if="menus.length > 0"
        v-for="menu in menus"
        :key="menu.id"
        class="menu-card"
        :to="`/owner/menu-detail/${menu.id}`"
      >
        <h3>{{ menu.name }}</h3>
        <p>{{ menu.description || "No description" }}</p>
        <small>Items: {{ menu.item_count || 0 }}</small>
      </RouterLink>
      <div v-else class="menu-card">
        <h3>Menu Name</h3>
        <p>Menu Description</p>
        <small>Menu Items: 0</small>
      </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>Create New Menu</h3>
        <label>Name</label>
        <input v-model="form.name" placeholder="Menu name" />

        <label>Description</label>
        <textarea v-model="form.description" placeholder="Optional"></textarea>

        <div class="actions">
          <button class="btn" @click="createNewMenu">Create</button>
          <button class="btn secondary" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="nextPage || prevPage">
      <button class="btn-secondary" :disabled="!prevPage" @click="loadPage(prevPage, currentPage - 1)">
        ⬅ Previous
      </button>
      <span class="page-info">📄 Page {{ currentPage }}</span>
      <button class="btn-secondary" :disabled="!nextPage" @click="loadPage(nextPage, currentPage + 1)">
        Next ➡
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount} from "vue";
import { useRouter } from "vue-router";
import { fetchMenus, createMenu } from "../../../services/owner/menu.ts";
import { selectedRestaurantId } from "../../../stores/restaurantState.ts";
import {useToast} from "vue-toastification";

interface Menu {
  id: number;
  name: string;
  description?: string;
  item_count?: number;
}

const menus = ref<Menu[]>([]);
const loading = ref(false);
const showModal = ref(false);
const form = ref({ name: "", description: "" });
const router = useRouter();
const toast = useToast();

const nextPage = ref<string | null>(null)
const prevPage = ref<string | null>(null)
const currentPage = ref<number>(1)


async function loadMenus(url: string | null = null, page = 1) {
  try {
    loading.value = true;

    if (!selectedRestaurantId.value) {
      toast.error("Please select a restaurant first.");
      menus.value = [];
    } else {
      const data: any = url ? await fetchMenus(selectedRestaurantId.value, url) :
          await fetchMenus(selectedRestaurantId.value, `?page=${page}`);
      menus.value = data.results
      nextPage.value = data.next
      prevPage.value = data.previous
      currentPage.value = page
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to load menus.");
  }
  finally {
    loading.value = false;
  }
}

function openCreateModal() {
  form.value = { name: "", description: "" };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function createNewMenu() {
  if (!form.value.name.trim()) {
    toast.error("Menu name is required.");
    return;
  }
  if (!selectedRestaurantId.value) {
    toast.error("Please select a restaurant first.");
    return;
  }

  try {
    await createMenu({
      restaurant: selectedRestaurantId.value,
      name: form.value.name,
      description: form.value.description,
    });
    toast.success("Menu created successfully!");
    await loadMenus();
    closeModal();
  } catch (err) {
    console.error(err);
    toast.error("Failed to create menu.");
  }
}

function goToMenu(id: number) {
  router.push({ name: "MenuDetail", params: { id } });
}

function loadPage(url: string | null, page: number) {
  if (url) loadMenus(url, page)
}

function refreshRestaurants() {
  loadMenus(`?page=${currentPage.value}`)
}

onMounted(async () => {
  await loadMenus();
  window.addEventListener("restaurant-changed", refreshRestaurants);
});

onBeforeUnmount(() => {
  window.removeEventListener("restaurant-changed", refreshRestaurants);
});

</script>

<style scoped>
.menu-manager {
  padding: 25px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}
.menu-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  cursor: pointer;
  transition: 0.2s;
  border: 1px solid #eee;
  text-decoration: none;
}
.menu-card:hover {
  background: #eef3ff;
}
.loading,
.empty {
  text-align: center;
  color: gray;
  margin-top: 50px;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}
.btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.btn.secondary {
  background: #aaa;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  padding: 8px 10px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.25s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.btn-secondary {
  background: #e5e7eb;
  padding: 9px 16px;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-secondary:hover:not(:disabled) {
  background: #d1d5db;
  transform: translateY(-2px);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Pagination */
.pagination {
  margin-top: 28px;
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
}

.page-info {
  padding: 7px 16px;
  border-radius: 20px;
  background: #f3f4f6;
  font-weight: 600;
  color: #374151;
}

</style>
