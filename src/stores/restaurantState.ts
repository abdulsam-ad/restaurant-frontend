import { ref, watch } from "vue";
import { fetchOwnedRestaurants } from "../services/restaurants";

export const ownedRestaurants = ref<{ id: number; name: string }[]>([]);
export const selectedRestaurantId = ref<number | null>(null);

export async function loadRestaurants() {
  try {
    ownedRestaurants.value = await fetchOwnedRestaurants();
    const savedId = localStorage.getItem("selectedRestaurantId");

    if (savedId) {
      selectedRestaurantId.value = Number(savedId);
    } else if (ownedRestaurants.value.length > 0) {
      selectedRestaurantId.value = ownedRestaurants.value[0]!.id;
    }
  } catch (err) {
    console.error("Failed to load restaurants", err);
  }
}

watch(selectedRestaurantId, (newId) => {
  if (newId !== null) {
    localStorage.setItem("selectedRestaurantId", String(newId));
  }
});
