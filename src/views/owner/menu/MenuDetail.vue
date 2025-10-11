<template>
  <div class="menu-detail">
    <div class="header">
      <h2>{{ menu?.name }}</h2>
      <p class="description">{{ menu?.description || "No description available." }}</p>
      <button class="btn" @click="openCreateModal">+ Add Menu Item</button>
    </div>

    <div v-if="loading" class="loading">Loading menu items...</div>

    <div v-else-if="menuItems.length === 0" class="empty">
      <p>No menu items yet. Add one to get started!</p>
    </div>

    <div v-else class="items-grid">
      <div v-for="item in menuItems" :key="item.id" class="item-card">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description || "No description" }}</p>
        <small>Price: {{ item.price ? `$${item.price}` : "N/A" }}</small>
      </div>
    </div>

    <!-- Create Item Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>Add New Item</h3>

        <label>Name</label>
        <input v-model="form.name" placeholder="Item name" />

        <label>Description</label>
        <textarea v-model="form.description" placeholder="Optional"></textarea>

        <label>Price</label>
        <input v-model.number="form.price" type="number" placeholder="0.00" />

        <div class="actions">
          <button class="btn" @click="createNewItem">Save</button>
          <button class="btn secondary" @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import { fetchMenusById } from "../../../services/owner/menu.ts";
import { createMenuItem, fetchMenuItems } from "../../../services/owner/menuItem.ts";
import { selectedRestaurantId } from "../../../stores/restaurantState.ts";

const route = useRoute();
const toast = useToast();

const menuId = Number(route.params.id);
const menu = ref<any>(null);
const menuItems = ref<any[]>([]);
const loading = ref(false);
const showModal = ref(false);
const form = ref({ name: "", description: "", price: null });

async function loadMenu() {
  try {
    if (!selectedRestaurantId.value) {
      toast.error("Please select a restaurant first.");
      menu.value = null;
    }
    else {
      const data: any = await fetchMenusById(selectedRestaurantId.value, menuId); // or fetch single menu if you have that endpoint
      menu.value = data.results?.[0] || data; // adjust if single object returned
    }
  } catch (err) {
    console.error(err);
  }
}

async function loadItems() {
  try {
    loading.value = true;
    const data: any = await fetchMenuItems(menuId);
    menuItems.value = data.results;
  } catch (err) {
    toast.error("Failed to load items.");
  } finally {
    loading.value = false;
  }
}

function openCreateModal() {
  form.value = { name: "", description: "", price: null };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function createNewItem() {
  if (!form.value.name.trim()) {
    toast.error("Item name is required.");
    return;
  }

  try {
    await createMenuItem({
      menu: menuId,
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
    });
    toast.success("Item added successfully!");
    await loadItems();
    closeModal();
  } catch (err) {
    toast.error("Failed to create item.");
  }
}

onMounted(async () => {
  await loadMenu();
  await loadItems();
});
</script>

<style scoped>
.menu-detail {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.header {
  margin-bottom: 20px;
}
.description {
  color: gray;
  margin-bottom: 10px;
}
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
}
.item-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #eee;
  transition: 0.2s;
}
.item-card:hover {
  background: #eef3ff;
}
.loading,
.empty {
  text-align: center;
  color: gray;
  margin-top: 40px;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
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
</style>
