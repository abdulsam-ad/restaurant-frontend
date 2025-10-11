<template xmlns="http://www.w3.org/1999/html">
  <div class="detail-page" v-if="restaurant">
    <!-- Header -->
    <div class="detail-header card">
      <!-- Banner -->
      <div class="info-card">
        <div class="banner-wrapper">
          <img
            v-if="editForm.image"
            :src="editForm.image"
            alt="Restaurant Banner"
            class="banner"
          />
          <div v-else class="banner placeholder">🍽️ No Banner</div>
          <label v-if="editMode" class="banner-edit">
            <input
                type="file"
                accept="image/*"
                @change="handleBannerChange"
                class="hidden vis-hidden"
            />
            <div v-if="editForm.image" class="banner" />
            <span class="banner-btn">✎</span>
          </label>
        </div>

        <!-- Title & Description -->
        <input
          v-model="editForm.name"
          :disabled="!editMode || isSaving"
          placeholder="Restaurant Name"
          class="editable-title"
        />
        <textarea
          v-model="editForm.description"
          :disabled="!editMode || isSaving"
          placeholder="Description"
          class="editable-subtitle"
        ></textarea>
      </div>
    </div>

    <!-- Info Section -->
    <div class="info-grid card">
      <div class="info-card">
        <h4>📍 Address</h4>
        <input
          v-model="editForm.address"
          :disabled="!editMode || isSaving"
          placeholder="Address"
          class="editable-input"
        />
      </div>

      <div class="info-card">
        <h4>📞 Phone</h4>
        <input
          v-model="editForm.phone_number"
          :disabled="!editMode || isSaving"
          placeholder="Phone Number"
          class="editable-input"
        />
      </div>

      <div class="info-card">
        <h4>📧 Email</h4>
        <input
          v-model="editForm.email"
          :disabled="!editMode || isSaving"
          placeholder="Email"
          type="email"
          class="editable-input"
        />
      </div>
    </div>

    <div
        class="info-grid card"
          :class="{ 'dropdown-open': showWaitersDropdown || showOwnersDropdown }"
    >
      <!-- Owners -->
      <div class="info-card chip-section autocomplete">
        <h4>👨‍💼 Owners</h4>
        <div class="chip-list">
          <div class="search-row">
            <input
              type="text"
              v-if="editMode"
              v-model="ownerSearch"
              placeholder="Add owner..."
              :disabled="!editMode || isSaving"
              @input="debouncedSearchOwners"
              @focus="showOwnersDropdown = true; showWaitersDropdown = false"
              class="chip-input"
            />
          </div>
          <transition name="fade">
            <ul v-if="showOwnersDropdown && editMode" class="dropdown">
              <li v-for="o in filteredOwners" :key="o.id" @click="addOwner(o)">
                {{ o.username }}
              </li>
              <li v-if="!filteredOwners.length" class="no-results">No owner found.</li>
            </ul>
          </transition>
          <div v-if="!editMode">
            <RouterLink
                v-for="o in editForm.owners"
                :key="o.id"
                :to="`/super/users/${o.username}`"
                class="chip blue-chip"
            >
              👨‍💼 {{ o.username }}
            </RouterLink>
          </div>
          <div v-else>
            <span v-for="o in editForm.owners" :key="o.id" class="chip blue-chip">
              👨‍💼 {{ o.username }}
              <button
                v-if="editMode"
                class="chip-remove"
                @click="removeOwner(o)"
              >❌</button>
            </span>
          </div>
        </div>
      </div>

      <!-- Waiters -->
      <div class="info-card chip-section autocomplete">
        <h4>👨‍🍳 Waiters</h4>
        <div class="chip-list">
          <div class="search-row">
            <input
              v-if="editMode"
              v-model="waiterSearch"
              placeholder="Add waiter..."
              :disabled="!editMode || isSaving"
              @input="debouncedSearchWaiters"
              @focus="showWaitersDropdown = true; showOwnersDropdown = false"
              class="chip-input"
            />
          </div>
          <transition name="fade">
            <ul v-if="showWaitersDropdown && editMode" class="dropdown">
              <li v-for="w in filteredWaiters" :key="w.id" @click="addWaiter(w)">
                {{ w.username }}
              </li>
              <li v-if="!filteredWaiters.length" class="no-results">No waiter found.</li>
            </ul>
          </transition>
          <div v-if="!editMode">
            <RouterLink
                v-for="w in editForm.waiters"
                :key="w.id"
                :to="`/super/users/${w.username}`"
                class="chip green-chip">
              🙋 {{ w.username }}
            </RouterLink>
          </div>
          <div v-else>
            <span v-for="w in editForm.waiters" :key="w.id" class="chip green-chip">
              🙋 {{ w.username }}
              <button
                v-if="editMode"
                class="chip-remove"
                @click="removeWaiter(w)"
              >❌</button>
            </span>
          </div>
        </div>
      </div>

    </div>

    <!-- Actions -->
    <div class="actions">
      <button v-if="!editMode" class="btn btn-primary" @click="toggleEdit" :disabled="isSaving">
        ✏️ Edit
      </button>

      <div v-else class="edit-actions">
        <button class="btn btn-secondary" @click="cancelEdit" :disabled="isSaving">
          ↩ Cancel
        </button>
        <button class="btn btn-danger" v-if="isExisting" @click="showDeleteConfirm = true" :disabled="isSaving">
          🗑 Delete
        </button>
        <button class="btn btn-success" @click="saveChanges" :disabled="!isDirty || isSaving">
          <span v-if="isSaving">⏳ Saving...</span>
          <span v-else>💾 Save</span>
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition name="fade">
      <div v-if="showDeleteConfirm" class="modal" @click.self="showDeleteConfirm = false">
        <div class="modal-content">
          <h3>⚠️ Delete User</h3>
          <p>Are you sure you want to delete <strong>{{ restaurant.name }}</strong>?</p>
          <div class="modal-actions">
            <button class="btn btn-danger" @click="confirmDelete" :disabled="isSaving">Yes, Delete</button>
            <button class="btn btn-secondary" @click="showDeleteConfirm = false" :disabled="isSaving">Cancel</button>
          </div>
        </div>
      </div>
    </transition>

  </div>

  <!-- Loading -->
  <p v-else>Loading restaurant details...</p>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  fetchRestaurantById,
  patchRestaurantApi,
  deleteRestaurantApi,
  createRestaurantApi,
} from "../../services/restaurants.ts";
import debounce from "lodash.debounce";
import { fetchOwnersLite, fetchWaitersLite } from "../../services/users.ts";

const route = useRoute();
const router = useRouter();

const restaurant = ref<any>({});
const original = ref<any>(null);
const editForm = ref<any>({});
const editMode = ref(false);
const isSaving = ref(false);

const ownerSearch = ref("");
const owners = ref<any[]>([]);
const showOwnersDropdown = ref(false);
const waiterSearch = ref("");
const waiters = ref<any[]>([]);
const showWaitersDropdown = ref(false);
const showDeleteConfirm = ref(false);

const avatarFile = ref<File | null>(null);

const isExisting = computed(() => (route.params.id && route.params.id !== "new"));

const form = ref({
  name: "",
  description: "",
  address: "",
  phone_number: "",
  email: "",
  owners: [],
  waiters: [],
  image: null,
})

const errorMsg = ref<string>('')

const isDirty = computed(() => {
  if (!original.value) return true;

  const fields = ["name", "description", "address", "phone_number", "email"];

  for (const f of fields) {
    const a = original.value[f] ?? "";
    const b = editForm.value[f] ?? "";
    if ((a + "") !== (b + "")) return true;
  }

  const origOwners = (original.value.owners || []).map((o: any) => o.id).sort();
  const editOwners = (editForm.value.owners || []).map((o: any) => o.id).sort();

  if (origOwners.length !== editOwners.length) return true;

  for (let i = 0; i < origOwners.length; i++) if (origOwners[i] !== editOwners[i]) return true;

  const origWaiters = (original.value.waiters || []).map((w: any) => w.id).sort();
  const editWaiters = (editForm.value.waiters || []).map((w: any) => w.id).sort();

  if (origWaiters.length !== editWaiters.length) return true;

  for (let i = 0; i < origWaiters.length; i++) if (origWaiters[i] !== editWaiters[i]) return true;

  return !!avatarFile.value;
});


const filteredOwners = computed(() => owners.value);
const filteredWaiters = computed(() => waiters.value);

function parseError(err: any): string {
  if (err.response?.data) {
    const data = err.response.data
    if (typeof data === 'string') return data.length < 100 ? data : 'Error occurred'
    if (typeof data === 'object') {
      const combined = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n')
      return combined.length < 150 ? combined : 'Error occurred'
    }
  }
  return err.message || 'Network error'
}

async function loadRestaurant() {
  if (isExisting.value) {
    const r = await fetchRestaurantById(Number(route.params.id))
    restaurant.value = r || {}

    original.value = JSON.parse(JSON.stringify({
      ...restaurant.value,
      owners: (restaurant.value.owners_detail || []).map((o: any) => ({ username: o.username })),
      waiters: (restaurant.value.waiters_detail || []).map((w: any) => ({ username: w.username })),
    }));
    editForm.value = {
      name: restaurant.value.name ?? "",
      description: restaurant.value.description ?? "",
      address: restaurant.value.address ?? "",
      phone_number: restaurant.value.phone_number ?? "",
      email: restaurant.value.email ?? "",
      owners: (restaurant.value.owners_detail || []).map((o: any) => ({ id: o.id, username: o.username })),
      waiters: (restaurant.value.waiters_detail || []).map((w: any) => ({ id: w.id, username: w.username })),
      image: restaurant.value.images?.[0]?.image || null,
    }

    avatarFile.value = null;
  } else {
    // New restaurant
    original.value = null;
    editMode.value = true;

    editForm.value = {
      id: null,
      name: "",
      description: "",
      address: "",
      phone_number: "",
      email: "",
      owners: [],
      waiters: [],
      image: null,
    };
    avatarFile.value = null;
  }
}

function toggleEdit() {
  editMode.value = true;

  if (original.value) {
    editForm.value = {
      name: restaurant.value.name ?? "",
      description: restaurant.value.description ?? "",
      address: restaurant.value.address ?? "",
      phone_number: restaurant.value.phone_number ?? "",
      email: restaurant.value.email ?? "",
      owners: (restaurant.value.owners_detail || []).map((o: any) => ({ id: o.id, username: o.username })),
      waiters: (restaurant.value.waiters_detail || []).map((w: any) => ({ id: w.id, username: w.username })),
      image: restaurant.value.images?.[0]?.image || null,
    };
    avatarFile.value = null;
  }
}

function cancelEdit() {
  if (!original.value) {
    router.push("/super/restaurants");
    return;
  }

  if (original.value.id) {
    router.push(`/super/restaurants/${original.value.id}`);
    avatarFile.value = null;
    showOwnersDropdown.value = false;
    showWaitersDropdown.value = false;
    editMode.value = false;
    return;
  }

  editMode.value = false;
  editForm.value = {
    name: original.value.name ?? "",
    description: original.value.description ?? "",
    address: original.value.address ?? "",
    phone_number: original.value.phone_number ?? "",
    email: original.value.email ?? "",
    owners: (original.value.owners || []).map((o: any) => ({ id: o.id, username: o.username })),
    waiters: (original.value.waiters || []).map((w: any) => ({ id: w.id, username: w.username })),
    image: original.value.images.length > 0 ?
        original.value.images[0] : null,
  };

  avatarFile.value = null;
  showOwnersDropdown.value = false;
  showWaitersDropdown.value = false;
}

async function saveChanges() {
  if (!isDirty.value || isSaving.value) return;
  isSaving.value = true;
  form.value = editForm.value;

  try {
    const payload: any = {
      ...form.value,
      owners: editForm.value.owners.length > 0 ?
          editForm.value.owners.map((o: any) => o.id) : null,
      waiters: editForm.value.waiters.length > 0 ?
          editForm.value.waiters.map((w: any) => w.id) : null,
      image: avatarFile.value || null,
    }

    if (!form.value.owners) delete payload.owners

    if (!form.value.waiters) delete payload.waiters

    if (isExisting.value) {
      const updatedRestaurant = await patchRestaurantApi(restaurant.value.id, payload);
      await router.push(`/super/restaurants/${updatedRestaurant.id}`);
    } else {
      const newRestaurant = await createRestaurantApi(payload);
      await router.push(`/super/restaurants/${newRestaurant.id}`);
    }

    await loadRestaurant();
    editMode.value = false;
    avatarFile.value = null;
  } catch (err: any) {
    errorMsg.value = parseError(err)
    console.error(errorMsg.value)
    return
  } finally {
    isSaving.value = false;
  }
}

// delete
async function confirmDelete() {
  if (!isExisting.value) return;
  isSaving.value = true;
  try {
    await deleteRestaurantApi(restaurant.value.id);
    await router.push("/super/restaurants");
  } catch (err) {
    console.error("delete failed", err);
    errorMsg.value = parseError(err)
  } finally {
    isSaving.value = false;
  }
}

function addOwner(o: any) {
  if (!editForm.value.owners.find((x: any) => x.username === o.username)) {
    editForm.value.owners.push({ id: o.id, username: o.username });
  }

  showOwnersDropdown.value = false;
}

function removeOwner(o: any) {
  editForm.value.owners = editForm.value.owners.filter((x: any) => x.id !== o.id);
}

function addWaiter(w: any) {
  if (!editForm.value.waiters.find((x: any) => x.username === w.username)) {
    editForm.value.waiters.push({ id: w.id, username: w.username });
  }

  showWaitersDropdown.value = false;
}

function removeWaiter(w: any) {
  editForm.value.waiters = editForm.value.waiters.filter((x: any) => x.id !== w.id);
}

const debouncedSearchOwners = debounce(async () => {
  try {
    owners.value = await fetchOwnersLite(ownerSearch.value);
  } catch (err: any) {
    owners.value = [];
    console.error("restaurant search error", err);
    errorMsg.value = parseError(err);
  }
}, 350);

const debouncedSearchWaiters = debounce(async () => {
  try {
    waiters.value = await fetchWaitersLite(waiterSearch.value);
  } catch (err: any) {
    waiters.value = [];
    console.error("restaurant search error", err);
    errorMsg.value = parseError(err);
  }
}, 350);

function handleBannerChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files.length) return;
  const f = input.files[0];
  // basic validation
  if (!f?.type.startsWith("image/")) return;
  avatarFile.value = f ?? null;
  editForm.value.image = URL.createObjectURL(f);
}

// auto-close dropdown when clicking outside
function onDocOwnersClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  // if clicked inside .autocomplete, keep; else hide
  if (!target.closest(".autocomplete")) showOwnersDropdown.value = false;
}

// auto-close dropdown when clicking outside
function onDocWaitersClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  // if clicked inside .autocomplete, keep; else hide
  if (!target.closest(".autocomplete")) showWaitersDropdown.value = false;
}

onMounted(() => {
  loadRestaurant();
  debouncedSearchOwners();
  debouncedSearchWaiters();
  document.addEventListener("click", onDocOwnersClick);
  document.addEventListener("click", onDocWaitersClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocOwnersClick);
  document.removeEventListener("click", onDocWaitersClick);
})

</script>

<style scoped>
* { box-sizing: border-box; }
.detail-page {
  padding: 20px;
  max-width: 980px;
  margin: 18px auto;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #0f172a;
}

/* visually hidden file input */
.vis-hidden
{
  position: absolute;
  left: -9999px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(2,6,23,0.06);
  padding: 16px;
  margin-bottom: 18px;
  transition: box-shadow 0.2s ease, transform 0.18s ease;
}
.card:hover
{
  box-shadow: 0 10px 30px rgba(2,6,23,0.08);
  transform: translateY(-2px);
}
.card.dropdown-open:hover {
  transform: none;
}
.detail-header {
  text-align: center;
  margin-bottom: 20px;
}

.banner-wrapper {
  position: relative;
  display: inline-block;
}

.banner {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 12px;
}
.banner.placeholder {
  width: 100%;
  max-height: 250px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 1.2rem;
  border-radius: 12px;
}

.banner-edit {
  position: absolute;
  bottom: 25px;
  right: 5px;
}
.banner-btn {
  background: #3b82f6;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.editable-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  border: none;
  background: transparent;
  margin-bottom: 8px;
  width: 100%;
}
.editable-subtitle {
  color: #555;
  border: none;
  background: transparent;
  resize: none;
  width: 100%;
  text-align: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.info-card {
  background: #f9fafb;
  padding: 14px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.editable-input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 6px;
}

/* Autocomplete & dropdown */
.autocomplete {
  position: relative;
  padding: 12px;
}
.search-row { display:flex; gap:8px; align-items:center; }
.search-row input { flex:1; min-width:0; }
.dropdown {
  position: absolute;
  left: 12px;
  right: 12px;
  top: calc(100% + 8px);
  z-index: 40;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(2,6,23,0.08);
  border: 1px solid #e6eef6;
  max-height: 260px;
  overflow-y: auto;
  padding: 6px 0;
}
.dropdown li {
  list-style: none;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  color: #0f172a;
}
.dropdown li:hover
{
  background: #f8fafc;
}
.no-results { padding: 10px; color:#94a3b8; text-align:center; }

/* Selected restaurants and chips */
.selected { margin-top: 10px; font-weight: 600; color: #059669; }
.selected-restaurants { margin-top: 8px; display:flex; flex-wrap:wrap; gap:8px; }


.chip-section {
  margin-bottom: 20px;
}
.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.chip {
  display: inline-block;
  padding: 5px 12px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
}

.blue-chip {
  background: #f3f4f6;
  color: #2563eb;
  border: 1px solid #dbeafe;
}

.blue-chip:hover {
  background: #2563eb;
  color: white;
  transform: scale(1.08);
  box-shadow: 0 3px 8px rgba(37, 99, 235, 0.4);
}

.green-chip {
  background: #f3f4f6;
  color: #059669;
  border: 1px solid #d1fae5;
}

.green-chip:hover {
  background: #059669;
  color: white;
  transform: scale(1.08);
  box-shadow: 0 3px 8px rgba(5, 150, 105, 0.4);
}


.chip-remove {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.8rem;
}
.chip-input {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 4px 8px;
  min-width: 120px;
}


/* Actions */
.actions
{
  margin-top: 12px;
  display:flex;
  justify-content:center;
  gap: 8px;
  align-items:center;
}
.edit-actions {
  display:flex;
  gap: 10px;
  align-items:center;
}


.btn {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  min-width: 90px;
}
.btn.small { padding: 6px 9px; min-width: 40px; }
.btn-primary { background: linear-gradient(180deg,#2563eb,#1e40af); color: #fff; box-shadow: 0 8px 20px rgba(37,99,235,0.12); }
.btn-secondary { background: linear-gradient(180deg,#f3f4f6,#e6eef6); color:#0b1220; border: 1px solid #e6eef6; }
.btn-success { background: linear-gradient(180deg,#10b981,#059669); color:#fff; }
.btn-danger { background: linear-gradient(180deg,#ef4444,#dc2626); color:#fff; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

/* Modal */
.modal {
  position: fixed;
  inset: 0;
  display:flex; align-items:center; justify-content:center;
  background: rgba(2,6,23,0.45);
  z-index: 60;
}
.modal-content {
  width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(2,6,23,0.2);
}
.modal-actions { margin-top: 16px; display:flex; gap:10px; justify-content:center; }

/* transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

</style>
