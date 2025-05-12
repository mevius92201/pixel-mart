const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
// const { getCountFromServer } = require("firebase-admin/firestore");

initializeApp();

exports.getProducts = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // 處理 preflight request
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

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
    // const countSnapshot = await getCountFromServer(queryRef);
    // const total = countSnapshot.data().count;

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
      total: data.length,
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

exports.addCart = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "請先登入好ㄇ",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { product_id, qty } = req.body;

    if (!product_id || typeof qty !== "number") {
      return res.status(400).json({
        success: false,
        message: "缺少必要欄位 product_id 或 qty",
      });
    }

    const db = getFirestore();
    const cartRef = db.collection("carts").doc(userId);
    const cartSnap = await cartRef.get();
    let cartItems = cartSnap.exists ? cartSnap.data().items || [] : [];

    const now = Timestamp.now();
    const index = cartItems.findIndex((item) => item.product_id === product_id);
    let updatedItem;

    if (index !== -1) {
      cartItems[index].qty += qty;
      cartItems[index].updated_at = now;
      updatedItem = cartItems[index];
    } else {
      updatedItem = {
        product_id,
        qty,
        added_at: now,
        updated_at: now,
      };
      cartItems.push(updatedItem);
    }

    await cartRef.set({ items: cartItems }, { merge: true });

    // 取得商品資料
    const productSnap = await db.collection("products").doc(product_id).get();
    if (!productSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "查無此商品",
      });
    }

    const productData = productSnap.data();

    const responseData = {
      product_id: product_id,
      qty: updatedItem.qty,
      total:
        updatedItem.qty *
        (productData.discount_price || productData.origin_price || 0),
      product: {
        id: product_id,
        name: productData.name || "",
        category: productData.category || "",
        content: productData.content || "",
        summary: productData.summary || "",
        image: {
          main: productData.image?.main || "",
          thumbnails: productData.image?.thumbnails || [],
        },
        num: productData.num || 0,
        origin_price: productData.origin_price || 0,
        discount_price: productData.discount_price || 0,
        tag: productData.tag || [],
        is_enabled: productData.is_enabled ?? 1,
      },
    };

    return res.status(200).json({
      success: true,
      message: "已加入購物車",
      data: responseData,
    });
  } catch (error) {
    console.error("addCart error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "伺服器錯誤",
    });
  }
});

exports.getCart = onRequest(async (req, res) => {
  const { getFirestore } = require("firebase-admin/firestore");
  const { getAuth } = require("firebase-admin/auth");

  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        messages: ["請先登入"],
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const db = getFirestore();
    const cartDoc = await db.collection("carts").doc(userId).get();

    if (!cartDoc.exists || !Array.isArray(cartDoc.data().items)) {
      return res.json({
        success: true,
        data: {
          carts: [],
          original_total: 0,
          final_total: 0,
        },
        messages: [],
      });
    }

    const cartItems = cartDoc.data().items;

    const productRefs = cartItems.map((item) =>
      db.collection("products").doc(item.product_id)
    );

    const productSnaps = await db.getAll(...productRefs);

    let carts = [];
    let original_total = 0;
    let final_total = 0;

    cartItems.forEach((item, index) => {
      const productSnap = productSnaps[index];
      if (!productSnap.exists) return;

      const productData = productSnap.data();
      const product_id = productSnap.id;

      const origin = productData.origin_price || 0;
      const discount = productData.discount_price || origin;
      const qty = item.qty || 0;

      const itemOriginalTotal = origin * qty;
      const itemFinalTotal = discount * qty;

      original_total += itemOriginalTotal;
      final_total += itemFinalTotal;

      carts.push({
        id: product_id,
        product_id: product_id,
        qty,
        total: itemOriginalTotal,
        final_total: itemFinalTotal,
        product: {
          id: product_id,
          name: productData.name || "",
          category: productData.category || "",
          content: productData.content || "",
          summary: productData.summary || "",
          image: {
            main: productData.image?.main || "",
            thumbnails: productData.image?.thumbnails || [],
          },
          is_enabled: productData.is_enabled ?? 1,
          num: productData.num || 0,
          origin_price: origin,
          discount_price: discount,
          tag: productData.tag || [],
        },
      });
    });

    return res.json({
      success: true,
      data: {
        carts,
        original_total,
        final_total,
      },
      messages: [],
    });
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({
      success: false,
      messages: [error.message || "伺服器錯誤"],
    });
  }
});
