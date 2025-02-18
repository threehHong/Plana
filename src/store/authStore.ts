import { create } from "zustand";
import supabase from "@/utils/supabase";

type AuthState = {
  token: string | null;
  /* userId: string | null; */
  setToken: (token: string | null /* , userId: string | null */) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  // 로컬 스토리지에서 초기 토큰 불러오기
  token: localStorage.getItem("authToken"),
  /* userId: localStorage.getItem("userId"), */

  setToken: (token /* , userId */) => {
    if (token /* && userId */) {
      localStorage.setItem("authToken", token);
      /* localStorage.setItem("userId", userId); */
    } else {
      localStorage.removeItem("authToken");
      /* localStorage.removeItem("userId"); */
    }
    set({ token /* , userId */ });
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("authToken");
    set({ token: null });
  },
}));
