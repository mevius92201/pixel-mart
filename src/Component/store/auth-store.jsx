import { create } from "zustand";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

const useAuthStore = create((set) => ({
  user: null,
  isAuth: false,
  cart: [],
  setUser: (user) => set({ user }),
  //no username this time
  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const randomAvatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${userCredential.user.uid}`;
      const initialBalance = 9999;
      const userData = {
        uid: userCredential.user.uid,
        email,
        // username,
        avatar: randomAvatar,
        balance: initialBalance,
        createdAt: Timestamp.now(),
      };
      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      set({
        user: userData,
        isAuth: true,
      });
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
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        set({
          user: { ...userData, uid: userCredential.user.uid },
          isAuth: true,
        });
      } else {
        set({
          user: {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
          },
          isAuth: true,
        });
      }
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
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            set({
              user: { uid: currentUser.uid, ...userData },
              isAuth: true,
            });
          } else {
            set({
              user: { uid: currentUser.uid, email: currentUser.email },
              isAuth: true,
            });
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        set({ user: null, isAuth: false });
      }
    });
  },
}));

export default useAuthStore;
