const admin = require("firebase-admin");
const fs = require("fs");

// 讀取 serviceAccount
const serviceAccount = require("./pixel-mart-14008-firebase-adminsdk-fbsvc-8b621d3300.json");

// 初始化 Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// 讀取json
const data = require("./products.json");
console.log("資料：", data);
const products = data.products;
console.log("產品：", products);
// 取得資料

async function importData() {
  const collectionRef = db.collection("products");

  const batch = db.batch();

  for (const product of products) {
    const existingSnapshot = await collectionRef
      .where("name", "==", product.name)
      .get();

    if (!existingSnapshot.empty) {
      console.log(`產品已存在，跳過：${product.name}`);
      continue;
    }

    const docRef = collectionRef.doc(); // 自動產生 ID
    batch.set(docRef, product);
    console.log(`加入上傳：${product.name}`);
  }

  await batch.commit();
  console.log("新增產品已成功匯入 Firestore（跳過已存在產品）");
}

importData().catch((err) => console.error("發生錯誤：", err));
