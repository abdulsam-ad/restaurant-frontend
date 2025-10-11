import { defineStore } from "pinia";
import { getMyProfile } from "../services/users.js";
import {logoutUser} from "../services/authentications.ts";


export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as any,
    loading: false,
  }),
  actions: {
    async loadUser() {
      this.loading = true;
      try {
        const res = await getMyProfile();
        this.user = res;
        localStorage.setItem("current-user", JSON.stringify(res));
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      await logoutUser()
      this.user = null;
    },
  },
});
