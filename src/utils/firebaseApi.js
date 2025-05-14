import axios from "axios";
import { getAuth } from "firebase/auth";

export const resetBalance = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error("未登入");
    }

    const token = await user.getIdToken();

    const response = await axios.post(
      "https://us-central1-pixel-mart-14008.cloudfunctions.net/resetBalance",
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("重置餘額失敗", err);
    throw err;
  }
};
