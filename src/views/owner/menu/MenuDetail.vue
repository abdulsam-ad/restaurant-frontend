<template>
  <div v-if="loadingMenu" class="loading-screen">
    <div class="spinner"></div>
    <p>Loading menu...</p>
  </div>

  <div v-else class="menu-detail">
    <!-- Header -->
    <div class="detail-header">
      <div>
        <h2>{{ menu?.name }}</h2>
        <p class="description">{{ menu?.description || "No description available." }}</p>
      </div>
      <div class="actions">
        <button class="btn" @click="openCreateModal">+ Add Item</button>
        <button class="btn secondary" @click="openCategoryModal">⚙ Manage Categories</button>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="category-filter">
      <button
        v-for="cat in ['All', ...categories.map(c => c.name)]"
        :key="cat"
        :class="['filter-btn', { active: selectedCategory === cat }]"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Items Grid -->
    <div v-if="loadingItems" class="loading">Loading items...</div>
    <div v-else-if="filteredItems.length === 0" class="empty">
      <p>No items found.</p>
    </div>
    <div v-else class="items-grid">
      <div v-for="item in filteredItems" :key="item.id" class="item-card">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description || "No description" }}</p>
        <small>Price: ${{ item.price || "N/A" }}</small>
        <p class="category-tag">{{ getCategoryName(item.category) || "Uncategorized" }}</p>
      </div>
    </div>

    <!-- Create / Edit Item Modal -->
    <div v-if="showItemModal" class="modal-overlay" @click.self="closeItemModal">
      <div class="modal">
        <h3>{{ editingItem ? "Edit Item" : "Add New Item" }}</h3>

        <label>Name</label>
        <input v-model="form.name" placeholder="Item name" />

        <label>Description</label>
        <textarea v-model="form.description" placeholder="Optional"></textarea>

        <label>Price</label>
        <input v-model.number="form.price" type="number" placeholder="0.00" />

        <label>Category</label>
        <select v-model="form.category">
          <option :value="null">Uncategorized</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <div class="actions">
          <button class="btn" @click="saveItem">{{ editingItem ? 'Update' : 'Save' }}</button>
          <button class="btn secondary" @click="closeItemModal">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Category Management Modal -->
    <div v-if="showCategoryModal" class="modal-overlay" @click.self="closeCategoryModal">
      <div class="modal">
        <h3>Manage Categories</h3>

        <div class="category-list">
          <div v-for="cat in categories" :key="cat.id" class="category-row">
            <input v-model="cat.name" class="category-input" />
            <div class="cat-actions">
              <button @click="updateCategoryName(cat)">💾</button>
              <button @click="removeCategory(cat.id)">🗑</button>
            </div>
          </div>
        </div>

        <div class="add-category">
          <input v-model="newCategory.name" placeholder="New category name" />
          <button @click="createNewCategory">Add</button>
        </div>

        <div class="actions mt-3">
          <button class="btn secondary" @click="closeCategoryModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { selectedRestaurantId } from "../../../stores/restaurantState.ts";
import { fetchMenuById } from "../../../services/owner/menu.ts";
import { createMenuItem, fetchMenuItems, updateMenuItem } from "../../../services/owner/menuItem.ts";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "../../../services/owner/category.ts";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const menuId = Number(route.params.id);
const menu = ref<any>(null);
const menuItems = ref<any[]>([]);
const categories = ref<any[]>([]);
const selectedCategory = ref("All");
const loadingMenu = ref(false);
const loadingItems = ref(false);

const showItemModal = ref(false);
const showCategoryModal = ref(false);
const editingItem = ref(false);

const form = ref({ id: null, name: "", description: "", price: null, category: null });
const newCategory = ref({
  name: "",
  description: "",
  restaurant: Number(selectedRestaurantId),
});

// --- Computed ---
const filteredItems = computed(() => {
  if (selectedCategory.value === "All") return menuItems.value;
  const cat = categories.value.find(c => c.name === selectedCategory.value);
  return menuItems.value.filter(item => item.category === cat?.id);
});

function getCategoryName(id: number) {
  return categories.value.find(c => c.id === id)?.name;
}

// --- Loaders ---
async function loadMenu() {
  try {
    if (!selectedRestaurantId.value) {
      return
    }
    loadingMenu.value = true;
    menu.value = await fetchMenuById(selectedRestaurantId.value, menuId);
  } catch {
    await router.push("/owner/menu");
  } finally {
    loadingMenu.value = false;
  }
}

async function loadItems() {
  loadingItems.value = true;
  try {
    const data = await fetchMenuItems(menuId);
    menuItems.value = data.results;
  } finally {
    loadingItems.value = false;
  }
}

async function loadCategories() {
  if (!selectedRestaurantId.value) {
    toast.error('Selected Restaurant is null')
    return
  }
  const data = await fetchCategories(selectedRestaurantId.value);
  categories.value = data.results;
}

// --- Item Modal ---
function openCreateModal() {
  editingItem.value = false;
  form.value = { id: null, name: "", description: "", price: null, category: null };
  showItemModal.value = true;
}
function closeItemModal() {
  showItemModal.value = false;
}
async function saveItem() {
  if (!form.value.name) return toast.error("Name required");
  try {
    if (editingItem.value) {
      if (!form.value.id) {
        return
      }
      await updateMenuItem(form.value.id, form.value);
      toast.success("Item updated!");
    } else {
      await createMenuItem(menuId, form.value);
      toast.success("Item created!");
    }
    closeItemModal();
    await loadItems();
  } catch {
    toast.error("Failed to save item");
  }
}

// --- Category Modal ---
function openCategoryModal() {
  showCategoryModal.value = true;
}
function closeCategoryModal() {
  showCategoryModal.value = false;
}
async function createNewCategory() {
  if (!newCategory.value.name.trim()) return;
  if (!selectedRestaurantId.value) return;
  newCategory.value.restaurant = selectedRestaurantId.value;
  await createCategory(selectedRestaurantId.value, newCategory.value);
  newCategory.value.name = "";
  await loadCategories();
}
async function updateCategoryName(cat: any) {
  if (!selectedRestaurantId.value) return;
  const restaurantId = selectedRestaurantId.value;
  await updateCategory(selectedRestaurantId.value, cat.id, { name: cat.name, restaurant: restaurantId });
  toast.success("Category updated");
}
async function removeCategory(id: number) {
  if (!selectedRestaurantId.value) return;
  await deleteCategory(selectedRestaurantId.value, id);
  await loadCategories();
}

// --- Lifecycle ---
onMounted(async () => {
  if (!selectedRestaurantId.value) {
    toast.error("Please select a restaurant first");
    await router.push("/owner/menu");
  } else {
    await Promise.all([loadMenu(), loadItems(), loadCategories()]);
  }
});

watch(selectedRestaurantId, async (newVal) => {
  if (newVal) await Promise.all([loadMenu(), loadItems(), loadCategories()]);
});
</script>

<style scoped>
.menu-detail {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.actions {
  display: flex;
  gap: 10px;
}
.category-filter {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}
.filter-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}
.filter-btn.active {
  background: #007bff;
  color: white;
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
.category-tag {
  font-size: 12px;
  color: #007bff;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 380px;
}
.category-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.category-input {
  flex: 1;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.cat-actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}
.add-category {
  display: flex;
  gap: 10px;
  margin-top: 10px;
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
  background: #6c757d;
}
.loading-screen, .loading, .empty {
  text-align: center;
  color: gray;
  margin-top: 40px;
}
.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #dbeafe;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  margin-bottom: 10px;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
