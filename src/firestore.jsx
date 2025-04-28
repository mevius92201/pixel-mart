import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { useEffect } from "react";

const TestFirestore = () => {
  useEffect(() => {
    const addUserToFirestore = async () => {
      try {
        await setDoc(doc(db, "users", "testUser123"), {
          username: "test_user",
          email: "test@example.com",
          balance: 100,
        });
        console.log("用戶已成功新增至 Firestore");
      } catch (error) {
        console.error("寫入失敗:", error);
      }
    };

    addUserToFirestore();
  }, []);
  // return <div>TestFirestore</div>;
};
export default TestFirestore;
