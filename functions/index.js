const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getCountFromServer } = require("firebase-admin/firestore");

initializeApp();

exports.getProducts = onRequest(async (req, res) => {
  try {
    const db = getFirestore();

    // 解析 query 參數
    const { page = 1, category, tag, keyword, sort, lastVisible } = req.query;

    const pageSize = 16;
    let queryRef = db.collection("products").where("is_enabled", "==", 1);

    // 類別篩選
    if (category) {
      queryRef = queryRef.where("category", "==", category);
    }

    // tag 陣列篩選
    if (tag) {
      queryRef = queryRef.where("tag", "array-contains", tag);
    }

    // 排序條件
    if (sort === "price_asc") {
      queryRef = queryRef.orderBy("origin_price", "asc");
    } else if (sort === "price_desc") {
      queryRef = queryRef.orderBy("origin_price", "desc");
    } else {
      queryRef = queryRef.orderBy("name"); // 預設按名稱排序
    }

    // 總數量查詢
    const countSnapshot = await getCountFromServer(queryRef);
    const total = countSnapshot.data().count;

    // 分頁游標處理
    if (lastVisible) {
      const lastDocSnapshot = await db
        .collection("products")
        .doc(lastVisible)
        .get();
      if (lastDocSnapshot.exists) {
        queryRef = queryRef.startAfter(lastDocSnapshot);
      }
    }

    // 查詢 Firestore
    const snapshot = await queryRef.limit(pageSize).get();

    if (snapshot.empty) {
      return res.json({
        success: true,
        products: [],
        messages: ["No products found."],
        lastVisible: null,
        total: 0,
        page: Number(page),
        pageSize,
      });
    }

    // 組合產品資料
    let data = snapshot.docs.map((doc) => {
      const d = doc.data();

      return {
        id: doc.id,
        name: d.name || "",
        category: d.category || "",
        content: d.content || "",
        summary: d.summary || "",
        image: {
          main: d.image?.main || "",
          thumbnails: d.image?.thumbnails || [],
        },
        num: d.num || 0,
        origin_price: d.origin_price || 0,
        discount_price: d.discount_price || 0,
        tag: d.tag || [],
      };
    });

    // 關鍵字篩選（前端查詢搜尋內容）
    if (keyword) {
      const lower = keyword.toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(lower) ||
          item.content.toLowerCase().includes(lower) ||
          item.summary.toLowerCase().includes(lower)
      );
    }
    if (data.length === 0) {
      return res.json({
        success: true,
        products: [],
        messages: ["查無商品資料"],
        lastVisible: null,
        total: 0,
        page: Number(page),
        pageSize,
      });
    }

    // 回傳結果
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    return res.json({
      success: true,
      products: data,
      messages: [],
      lastVisible: lastDoc ? lastDoc.id : null,
      total,
      page: Number(page),
      pageSize,
    });
  } catch (error) {
    console.error("getProducts error:", error);
    return res.status(500).json({
      success: false,
      products: [],
      messages: [error.message || "Internal server error"],
    });
  }
});

exports.addProduct = onRequest(async (req, res) => {
  // 只允許 POST 請求
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const db = getFirestore();
    const {
      name,
      category,
      content,
      summary,
      image,
      num,
      origin_price,
      discount_price,
      tag,
      is_enabled = 1,
    } = req.body;

    // 簡單驗證
    if (!name || !category || !image || !image.main) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, category, or image.main",
      });
    }

    const newProduct = {
      name,
      category,
      content: content || "",
      summary: summary || "",
      image: {
        main: image.main,
        thumbnails: image.thumbnails || [],
      },
      num: num || 0,
      origin_price: origin_price || 0,
      discount_price: discount_price || 0,
      tag: tag || [],
      is_enabled,
      created_at: new Date(),
    };

    const docRef = await db.collection("products").add(newProduct);

    res.json({
      success: true,
      id: docRef.id,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("addProduct error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
