<template xmlns="http://www.w3.org/1999/html">
  <div class="detail-page" @keydown.esc="onEscape">
    <!-- Header -->
    <div class="detail-header card">
      <div class="avatar-wrapper">
        <label class="avatar-edit" v-if="editMode">
          <input ref="avatarInput" type="file" accept="image/*" @change="handleAvatarChange" class="vis-hidden" />
          <div v-if="editForm.imagePreview" class="avatar" :style="{ backgroundImage: `url(${editForm.imagePreview})` }" />
          <div v-else class="avatar placeholder">👤</div>
          <button type="button" class="avatar-btn">✎</button>
        </label>

        <div v-else>
          <img v-if="user.image" :src="user.image" alt="User Avatar" class="avatar" />
          <div v-else class="avatar placeholder">👤</div>
        </div>
      </div>

      <div class="header-text">
        <h2 class="username-title">{{ user.username || "New User" }}</h2>
        <p class="subtitle">{{ user.email || "-" }}</p>
      </div>
    </div>

    <!-- Info Form -->
    <form class="form-grid card" @submit.prevent="saveChanges">
      <input
        class="half"
        v-model="editForm.first_name"
        :disabled="!editMode || isSaving"
        placeholder="First name"
        type="text"
      />
      <input
        class="half"
        v-model="editForm.last_name"
        :disabled="!editMode || isSaving"
        placeholder="Last name"
        type="text"
      />

      <input
        class="half"
        v-model="editForm.phone"
        :disabled="!editMode || isSaving"
        placeholder="Phone"
        type="tel"
      />

      <input
        class="half"
        v-model="editForm.username"
        :disabled="!editMode || isSaving"
        placeholder="Username"
        type="text"
      />

      <input
        class="half"
        v-model="editForm.email"
        :disabled="!editMode || isSaving"
        placeholder="Email"
        type="email"
      />

      <input
        class="half"
        v-model="editForm.password"
        :disabled="!editMode || isSaving"
        placeholder="Password"
        type="password"
      />

      <select
        class="half"
        v-model="editForm.user_type"
        :disabled="!editMode || isSaving"
        aria-label="User type"
      >
        <option value="user">User</option>
        <option value="waiter">Waiter</option>
        <option value="restaurant_owner">Restaurant Owner</option>
        <option value="super_admin">Super Admin</option>
      </select>

      <textarea
        class="full"
        v-model="editForm.bio"
        :disabled="!editMode || isSaving"
        placeholder="Bio"
      ></textarea>
    </form>

    <!-- Restaurants (waiter) -->
    <div v-if="editForm.user_type === 'waiter'" class="autocomplete card"
          :class="{ 'dropdown-open': showDropdown }"
    >
      <h4>🍽️ Working Restaurant</h4>
      <div class="search-row">
        <input
          type="text"
          v-model="restaurantSearch"
          placeholder="Search restaurant..."
          :disabled="!editMode || isSaving"
          @input="debouncedSearchRestaurants"
          @focus="showDropdown = true"
        />
        <button v-if="editMode && editForm.restaurant" class="btn small" @click="clearSingleRestaurant" :disabled="isSaving">✖</button>
      </div>

      <transition name="fade">
        <ul v-if="showDropdown && editMode" class="dropdown">
          <li v-for="r in filteredRestaurants" :key="r.id" @click="selectSingleRestaurant(r)">
            {{ r.name }}
          </li>
          <li v-if="!filteredRestaurants.length" class="no-results">No restaurants found.</li>
        </ul>
      </transition>

      <div class="selected">
        <RouterLink
            v-if="editForm.restaurant"
            :to="`/super/restaurants/${editForm.restaurant.id}`"
            class="chip green-chip"
        >
          🏨 {{ editForm.restaurant.name }}
        </RouterLink>
      </div>

    </div>

    <!-- Restaurants (owner) -->
    <div v-if="editForm.user_type === 'restaurant_owner'" class="autocomplete card"
          :class="{ 'dropdown-open': showDropdown }"
    >
      <h4>🏢 Owned Restaurants</h4>

      <div class="search-row">
        <input
          type="text"
          v-model="restaurantSearch"
          placeholder="Search restaurants..."
          :disabled="!editMode || isSaving"
          @input="debouncedSearchRestaurants"
          @focus="showDropdown = true"
        />
      </div>

      <transition name="fade">
        <ul v-if="showDropdown && editMode" class="dropdown">
          <li v-for="r in filteredRestaurants" :key="r.id" @click="selectRestaurant(r)">
            {{ r.name }}
          </li>
          <li v-if="!filteredRestaurants.length" class="no-results">No restaurants found.</li>
        </ul>
      </transition>

      <div v-if="!editMode">
        <RouterLink
            v-for="r in editForm.owned_restaurants"
            :to="`/super/restaurants/${r.id}`"
            :key="r.id"
            class="chip blue-chip"
        >
          🍽️ {{ r.name }}
        </RouterLink>
      </div>
      <div v-else>
        <span
            v-for="r in editForm.owned_restaurants"
            :key="r.id"
            class="chip blue-chip"
        >
          🍽️ {{ r.name }}
          <button type="button" v-if="editMode && !isSaving" @click="removeRestaurant(r)">×</button>
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions">
      <button v-if="!editMode" class="btn btn-primary" @click="toggleEdit" :disabled="isSaving">
        ✏️ Edit
      </button>

      <div v-else class="edit-actions">
        <button class="btn btn-secondary" @click="cancelEdit" :disabled="isSaving">↩ Cancel</button>
        <button class="btn btn-danger" v-if="isExisting" @click="showDeleteConfirm = true" :disabled="isSaving">🗑 Delete</button>
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
          <p>Are you sure you want to delete <strong>{{ user.username }}</strong>?</p>
          <div class="modal-actions">
            <button class="btn btn-danger" @click="confirmDelete" :disabled="isSaving">Yes, Delete</button>
            <button class="btn btn-secondary" @click="showDeleteConfirm = false" :disabled="isSaving">Cancel</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import debounce from "lodash.debounce";
import {
  fetchUserByUserName,
  patchUserApi,
  createUserApi,
  deleteUserApi
} from "../../services/users.ts";
import { fetchRestaurantLite } from "../../services/restaurants.ts";

const route = useRoute();
const router = useRouter();

const user = ref<any>({});
const original = ref<any>(null);
const editForm = ref<any>({});
const editMode = ref(false);
const isSaving = ref(false);

const restaurantSearch = ref("");
const restaurants = ref<any[]>([]);
const showDropdown = ref(false);
const showDeleteConfirm = ref(false);

const avatarFile = ref<File | null>(null);

const isExisting = computed(() => (route.params.username && route.params.username !== "new"));

const form = ref({
  first_name: '',
  last_name: '',
  phone: '',
  bio: '',
  email: '',
  username: '',
  password: '',
  user_type: 'user',
  restaurant: null,
  owned_restaurants: [],
  image: null,
})

const errorMsg = ref<string>('')

const isDirty = computed(() => {
  if (!original.value) return true; // new user
  // fields to compare
  const fields = ["first_name", "last_name", "phone", "bio", "email", "username", "password", "user_type"];
  for (const f of fields) {
    const a = original.value[f] ?? "";
    const b = editForm.value[f] ?? "";
    if ((a + "") !== (b + "")) return true;
  }

  const origRest = original.value.restaurant ? original.value.restaurant.id : null;
  const editRest = editForm.value.restaurant ? editForm.value.restaurant.id : null;
  if (origRest !== editRest) return true;

  const origOwned = (original.value.owned_restaurants || []).map((x: any) => x.id).sort();
  const editOwned = (editForm.value.owned_restaurants || []).map((x: any) => x.id).sort();
  if (origOwned.length !== editOwned.length) return true;
  for (let i = 0; i < origOwned.length; i++) if (origOwned[i] !== editOwned[i]) return true;

  return !!avatarFile.value;
});

const filteredRestaurants = computed(() => restaurants.value);

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

// load user
async function loadUser() {
  if (isExisting.value) {
    const u = await fetchUserByUserName(route.params.username as string);
    user.value = u || {};
    // original deep clone (simple)
    original.value = JSON.parse(JSON.stringify({
      ...user.value,
      // ensure restaurants represented with minimal fields
      restaurant: user.value.restaurant ? { id: user.value.restaurant.id } : null,
      owned_restaurants: (user.value.owned_restaurants || []).map((r: any) => ({ id: r.id })),
    }));
    editForm.value = {
      first_name: user.value.first_name ?? "",
      last_name: user.value.last_name ?? "",
      phone: user.value.phone ?? "",
      bio: user.value.bio ?? "",
      email: user.value.email ?? "",
      username: user.value.username ?? "",
      password: user.value.password ?? "",
      user_type: user.value.user_type ?? "user",
      restaurant: user.value.restaurant ?? null,
      owned_restaurants: (user.value.owned_restaurants || []).map((r: any) => ({ id: r.id, name: r.name })),
      imagePreview: user.value.image ?? null,
    };
    avatarFile.value = null;
  } else {
    // new user
    original.value = null;
    editMode.value = true;
    editForm.value = {
      first_name: "",
      last_name: "",
      phone: "",
      bio: "",
      email: "",
      username: "",
      password: "",
      user_type: "user",
      restaurant: null,
      owned_restaurants: [],
      imagePreview: null,
    };
    avatarFile.value = null;
  }
}

// toggle edit
function toggleEdit() {
  editMode.value = true;
  // copy current user state into editForm
  if (original.value) {
    editForm.value = {
      first_name: user.value.first_name ?? "",
      last_name: user.value.last_name ?? "",
      phone: user.value.phone ?? "",
      bio: user.value.bio ?? "",
      email: user.value.email ?? "",
      username: user.value.username ?? "",
      password: user.value.password ?? "",
      user_type: user.value.user_type ?? "user",
      restaurant: user.value.restaurant ?? null,
      owned_restaurants: (user.value.owned_restaurants || []).map((r: any) => ({ id: r.id, name: r.name })),
      imagePreview: user.value.image ?? null,
    };
    avatarFile.value = null;
  }
}

// cancel edit: revert to original
function cancelEdit() {
  if (!original.value) {
    // new user -> navigate back to users list
    router.push("/super/users");
    return;
  }

  if (original.value.username){
    router.push(`/super/users/${original.value.username}`)
    avatarFile.value = null;
    showDropdown.value = false;
    editMode.value = false;
    return;
  }

  editMode.value = false;
  // restore editForm from original snapshot
  editForm.value = {
    first_name: original.value.first_name ?? "",
    last_name: original.value.last_name ?? "",
    phone: original.value.phone ?? "",
    bio: original.value.bio ?? "",
    email: original.value.email ?? "",
    username: original.value.username ?? "",
    password: original.value.password ?? "",
    user_type: original.value.user_type ?? "user",
    restaurant: original.value.restaurant ? { id: original.value.restaurant.id, name: original.value.restaurant.name } : null,
    owned_restaurants: (original.value.owned_restaurants || []).map((r: any) => ({ id: r.id, name: r.name })),
    imagePreview: user.value.image ?? null,
  };
  avatarFile.value = null;
  showDropdown.value = false;
}

// save changes
async function saveChanges() {
  if (!isDirty.value || isSaving.value) return;
  isSaving.value = true;
  form.value = editForm.value;

  try {
    const payload: any = {
      ...form.value,
      restaurant: editForm.value.restaurant?.id ?? null,
      owned_restaurants: editForm.value.owned_restaurants.length > 0 ?
          editForm.value.owned_restaurants.map((rr: any) => rr.id) : null,
      image: avatarFile.value || null,
    }

    const {user_type, restaurant, owned_restaurants} = form.value
    switch (user_type) {
      case "waiter":
        delete payload.owned_restaurants
        if (!restaurant) {
          delete payload.restaurant
        }
        break
      case "restaurant_owner":
        delete payload.restaurant
        if (!owned_restaurants) {
          delete payload.owned_restaurants
        }
        break
      default:
        delete payload.restaurant
        delete payload.owned_restaurants
        break
    }

    if (isExisting.value) {
      const updatedUser = await patchUserApi(user.value.username, payload);
      await router.push(`/super/users/${updatedUser.username}`);
    } else {
      const newUser = await createUserApi(payload);
      await router.push(`/super/users/${newUser.username}`);
    }

    await loadUser();
    editMode.value = false;
    avatarFile.value = null;
  } catch (err: any) {
    errorMsg.value = parseError(err)
    console.error("Failed to save user", errorMsg.value);
  } finally {
    isSaving.value = false;
  }
}

// delete
async function confirmDelete() {
  if (!isExisting.value) return;
  isSaving.value = true;
  try {
    await deleteUserApi(user.value.username);
    await router.push("/super/users");
  } catch (err) {
    console.error("delete failed", err);
    errorMsg.value = parseError(err)
  } finally {
    isSaving.value = false;
  }
}

// restaurants helpers
function selectSingleRestaurant(r: any) {
  editForm.value.restaurant = r;
  showDropdown.value = false;
}
function clearSingleRestaurant() {
  editForm.value.restaurant = null;
}
function selectRestaurant(r: any) {
  if (!editForm.value.owned_restaurants.find((x: any) => x.id === r.id)) {
    editForm.value.owned_restaurants.push({ id: r.id, name: r.name });
  }
  showDropdown.value = false;
}
function removeRestaurant(r: any) {
  editForm.value.owned_restaurants = editForm.value.owned_restaurants.filter((x: any) => x.id !== r.id);
}

const debouncedSearchRestaurants = debounce(async () => {
  try {
    restaurants.value = await fetchRestaurantLite(restaurantSearch.value);
  } catch (err) {
    restaurants.value = [];
    console.error("restaurant search error", err);
    errorMsg.value = parseError(err);
  }
}, 350);

// avatar handlers
function handleAvatarChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files.length) return;
  const f = input.files[0];
  // basic validation
  if (!f?.type.startsWith("image/")) return;
  avatarFile.value = f ?? null;
  editForm.value.imagePreview = URL.createObjectURL(f);
}

// keyboard escape -> cancel edit
function onEscape() {
  if (editMode.value) cancelEdit();
}

// auto-close dropdown when clicking outside
function onDocClick(e: MouseEvent) {
  const target = e.target as HTMLElement;
  // if clicked inside .autocomplete, keep; else hide
  if (!target.closest(".autocomplete")) showDropdown.value = false;
}

onMounted(() => {
  loadUser();
  debouncedSearchRestaurants();
  document.addEventListener("click", onDocClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick);
});
</script>

<style scoped>
/* Root */
* { box-sizing: border-box; }
.detail-page {
  padding: 20px;
  max-width: 980px;
  margin: 18px auto;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #0f172a;
}

/* Card & header */
.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(2,6,23,0.06);
  padding: 16px;
  margin-bottom: 18px;
  transition: box-shadow 0.2s ease, transform 0.18s ease;
}
.card:hover { box-shadow: 0 10px 30px rgba(2,6,23,0.08); transform: translateY(-2px); }
.card.dropdown-open:hover {
  transform: none;
}

/* Header */
.detail-header {
  display: flex;
  gap: 18px;
  align-items: center;
  padding: 18px;
}
.avatar-wrapper
{
  position: relative;
  display:flex;
  align-items:center;
  gap: 12px;
}
.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  display: inline-block;
  box-shadow: 0 6px 16px rgba(2,6,23,0.12);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.avatar:hover
{
  transform: scale(1.03);
}
.avatar.placeholder {
  display:flex;
  align-items:center;
  justify-content:center;
  background:#f3f4f6;
  color:#94a3b8;
  font-size: 40px;
}

/* Avatar edit overlay (clickable) */
.avatar-edit {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.avatar-edit .avatar
{
  border-radius: 50%;
}
.avatar-edit .avatar-btn {
  position: absolute;
  right: 1px;
  bottom: 1px;
  background: linear-gradient(180deg,#0ea5a4,#059669);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px;
  box-shadow: 0 6px 16px rgba(2,6,23,0.12);
}
.avatar-edit:hover .avatar {
  outline: 2px solid #3b82f6;
}

/* visually hidden file input */
.vis-hidden
{
  position: absolute;
  left: -9999px;
}

/* Header text area */
.header-text { flex: 1; }
.username-title { font-size: 1.45rem; margin: 0 0 4px; font-weight: 700; color: #0b1220; }
.subtitle { margin: 0; color:#64748b; font-size: 0.95rem; }

/* Form grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.form-grid .full { grid-column: 1 / -1; }
.form-grid .half { grid-column: auto; min-width:0; } /* min-width prevents overflow in grid cells */

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"],
select,
textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e6eef6;
  background: #fff;
  font-size: 14px;
  min-height: 44px;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 6px 20px rgba(59,130,246,0.12);
}
textarea { min-height: 96px; resize: vertical; }

/* Autocomplete & dropdown */
.autocomplete { position: relative; padding: 12px; }
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
.dropdown li:hover { background: #f8fafc; }
.no-results { padding: 10px; color:#94a3b8; text-align:center; }

/* Selected restaurants and chips */
.selected { margin-top: 10px; font-weight: 600; color: #059669; }
.selected-restaurants { margin-top: 8px; display:flex; flex-wrap:wrap; gap:8px; }


.chip {
  display: inline-block;
  padding: 5px 12px;
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

.chip button {
  background: transparent;
  border: 0;
  font-size: 14px;
  cursor: pointer;
  color: #64748b;
}
.chip button:hover { color: #ef4444; }

/* Actions */
.actions { margin-top: 12px; display:flex; justify-content:center; gap: 8px; align-items:center; }
.edit-actions { display:flex; gap: 10px; align-items:center; }

/* Buttons */
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

/* Responsive */
@media (max-width: 720px) {
  .detail-header { flex-direction: column; gap: 12px; text-align:center; }
  .form-grid { grid-template-columns: 1fr; }
  .form-grid .full { grid-column: auto; }
  .dropdown { left: 12px; right: 12px; }
}
</style>
