import { create } from "zustand";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const useAuthStore = create((set) => ({
  user: null,
  isAuth: false,
  cart: [],
  setUser: (user) => set({ user }),

  register: async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const randomAvatar = `https://avatars.dicebear.com/api/avataaars/${user.uid}.svg`;
      const initialBalance = 9999;
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        username,
        avatar: randomAvatar,
        balance: initialBalance,
        createdAt: new Date(),
      });
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
      set({ user: null, isAuth: false, cart: [] });
    } catch (error) {
      console.error(error.message);
    }
  },
  //TBC
  setCart: (cartData) => set({ cart: cartData }),
  initAuth: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ user, isAuth: true });
      } else {
        set({ user: null, isAuth: false });
      }
    });
  },
}));

export default useAuthStore;
