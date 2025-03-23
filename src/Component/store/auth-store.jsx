import { create } from "zustand";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const useAuthStore = create((set) => ({
  user: null,
  isAuth: false,
  setUser: (user) => set({ user }),
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user });
      return { success: true };
    } catch (error) {
      console.error("failed", error);
      return { success: false, message: error.message };
    }
  },
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      set({ user: userCredential.user, isAuth: true });
      return { success: true };
    } catch (error) {
      console.error(error.message);
      return { success: false, message: error.message };
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAuth: false });
    } catch (error) {
      console.error(error.message);
    }
  },
}));

export default useAuthStore;
