const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
// const { getCountFromServer } = require("firebase-admin/firestore");

initializeApp();

exports.resetBalance = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).send("");

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "請先登入" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const db = getFirestore();
    await db.collection("users").doc(userId).update({ balance: 9999 });

    return res.json({ success: true, message: "餘額已重設為 9999" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

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

    const pageSize = 20;
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
      queryRef = queryRef.orderBy("final_price", "asc").orderBy("__name__");
    } else if (sort === "price_desc") {
      queryRef = queryRef.orderBy("final_price", "desc").orderBy("__name__");
    } else {
      queryRef = queryRef.orderBy("name");
    }

    // 分頁游標處理（特別處理價格排序的複合游標）
    if (
      lastVisible &&
      lastPrice &&
      (sort === "price_asc" || sort === "price_desc")
    ) {
      queryRef = queryRef.startAfter(Number(lastPrice), lastVisible);
    }

    // 總數量查詢
    // const countSnapshot = await getCountFromServer(queryRef);
    // const total = countSnapshot.data().count;

    // 分頁游標處理
    // if (lastVisible && (sort === "price_asc" || sort === "price_desc")) {
    //   const lastDocSnapshot = await db
    //     .collection("products")
    //     .doc(lastVisible)
    //     .get();

    //   if (lastDocSnapshot.exists) {
    //     const docData = lastDocSnapshot.data();
    //     const lastFinalPrice = docData.final_price || 0;
    //     queryRef = queryRef.startAfter(lastFinalPrice, lastVisible);
    //   }
    // }

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
      lastCursor: lastDoc
        ? {
            final_price: lastDoc.data().final_price || 0,
            id: lastDoc.id,
          }
        : null,
      total: data.length,
      page: Number(page),
      pageSize,
    });
  } catch (error) {
    console.error("getProducts error:", error.code, error.message, error);
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
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "請先登入" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);

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

    // 驗證必要欄位
    if (!name || !category || !image || !image.main) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, category, or image.main",
      });
    }

    // 決定 final_price（若 discount_price 為 0 或 undefined 則使用 origin_price）
    const hasDiscount = discount_price && Number(discount_price) > 0;
    const final_price = hasDiscount ? discount_price : origin_price;

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
      final_price: final_price || 0, // 新增欄位
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

    if (!cartDoc.exists) {
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

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
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

exports.removeCartProduct = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "請先登入",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const productId = req.query.product_id;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "缺少產品id",
      });
    }

    const db = getFirestore();
    const cartRef = db.collection("carts").doc(userId);
    const cartSnap = await cartRef.get();

    if (!cartSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "購物車不存在",
      });
    }

    const items = cartSnap.data().items || [];
    const updatedItems = items.filter((item) => item.product_id !== productId);

    await cartRef.set({ items: updatedItems }, { merge: true });

    return res.status(200).json({
      success: true,
      message: "已移除商品",
    });
  } catch (error) {
    console.error("removeCartProduct error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "伺服器錯誤",
    });
  }
});

exports.clearCart = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "請先登入",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const db = getFirestore();
    const cartRef = db.collection("carts").doc(userId);

    await cartRef.set({ items: [] }, { merge: true });

    return res.status(200).json({
      success: true,
      message: "購物車已清空",
    });
  } catch (error) {
    console.error("clearCart error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "伺服器錯誤",
    });
  }
});

exports.updateCartItem = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "PUT");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "PUT") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "請先登入",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { data } = req.body || {};
    const { product_id, qty } = data || {};

    if (!product_id || typeof qty !== "number" || qty < 1 || qty > 99) {
      return res.status(400).json({
        success: false,
        message: "請提供有效的 product_id 與 qty（1-99）",
      });
    }

    const db = getFirestore();
    const cartRef = db.collection("carts").doc(userId);
    const cartSnap = await cartRef.get();
    let cartItems = cartSnap.exists ? cartSnap.data().items || [] : [];

    const index = cartItems.findIndex((item) => item.product_id === product_id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "購物車中找不到該商品",
      });
    }

    cartItems[index].qty = qty;
    cartItems[index].updated_at = Timestamp.now();

    await cartRef.set({ items: cartItems }, { merge: true });

    // 回傳商品資訊（對齊 addCart）
    const productSnap = await db.collection("products").doc(product_id).get();
    if (!productSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "查無此商品",
      });
    }

    const product = productSnap.data();
    const price = product.discount_price || product.origin_price || 0;

    return res.status(200).json({
      success: true,
      message: "商品數量已更新",
      data: {
        product_id,
        qty,
        total: price * qty,
        product: {
          id: product_id,
          name: product.name || "",
          category: product.category || "",
          content: product.content || "",
          summary: product.summary || "",
          image: {
            main: product.image?.main || "",
            thumbnails: product.image?.thumbnails || [],
          },
          num: product.num || 0,
          origin_price: product.origin_price || 0,
          discount_price: product.discount_price || 0,
          tag: product.tag || [],
          is_enabled: product.is_enabled ?? 1,
        },
      },
    });
  } catch (error) {
    console.error("updateCartItem error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "伺服器錯誤",
    });
  }
});

exports.deduct = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).send("");

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "請先登入",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const db = getFirestore();
    const userRef = db.collection("users").doc(userId);
    const cartRef = db.collection("carts").doc(userId);

    const [userSnap, cartSnap] = await Promise.all([
      userRef.get(),
      cartRef.get(),
    ]);

    if (!userSnap.exists || !cartSnap.exists) {
      return res.status(400).json({
        success: false,
        message: "無法取得使用者或購物車資料",
      });
    }

    const user = userSnap.data();
    const cartItems = cartSnap.data().items || [];

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "購物車為空，無法結帳",
      });
    }

    // 取得所有商品資料
    const productRefs = cartItems.map((item) =>
      db.collection("products").doc(item.product_id)
    );
    const productSnaps = await db.getAll(...productRefs);

    let totalAmount = 0;
    let itemDetails = [];

    cartItems.forEach((item, i) => {
      const productDoc = productSnaps[i];
      if (!productDoc.exists) return;
      const product = productDoc.data();
      const price = product.discount_price || product.origin_price || 0;
      const subtotal = price * item.qty;
      totalAmount += subtotal;

      itemDetails.push({
        product_id: item.product_id,
        product_name: product.name || "",
        qty: item.qty,
        unit_price: price,
        subtotal,
      });
    });

    const originalBalance = user.balance || 0;
    const remainingBalance = originalBalance - totalAmount;

    if (remainingBalance < 0) {
      return res.status(400).json({
        success: false,
        message: "餘額不足",
        data: {
          original_balance: originalBalance,
          required_amount: totalAmount,
        },
      });
    }

    // 更新使用者餘額 & 清空購物車
    await Promise.all([
      userRef.update({ balance: remainingBalance }),
      cartRef.set({ items: [] }, { merge: true }),
    ]);

    return res.json({
      success: true,
      message: "扣款成功",
      data: {
        id: `${userId}-${Date.now()}`,
        original_balance: originalBalance,
        deducted_amount: totalAmount,
        remaining_balance: remainingBalance,
        purchased_items: itemDetails,
        user: {
          uid: userId,
          email: user.email,
        },
        cart: [],
      },
    });
  } catch (error) {
    console.error("deduct error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "伺服器錯誤",
    });
  }
});

exports.addNews = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).send("");

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    // const authHeader = req.headers.authorization;
    // if (!authHeader?.startsWith("Bearer ")) {
    //   return res.status(401).json({ success: false, message: "請先登入" });
    // }

    // const idToken = authHeader.split("Bearer ")[1];
    // const decodedToken = await getAuth().verifyIdToken(idToken);

    const {
      title,
      summary,
      banner,
      image,
      category,
      isPublic,
      isPinned,
      content,
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "缺少必要欄位 title, content 或 category",
      });
    }

    const db = getFirestore();
    const now = Timestamp.now();
    const newDoc = {
      title,
      summary: summary || "",
      banner: banner || "",
      image: image || "",
      category,
      isPublic: Boolean(isPublic),
      isPinned: Boolean(isPinned),
      content,
      created_at: now,
      updated_at: now,
    };

    await db.collection("news").add(newDoc);

    return res.json({ success: true, message: "文章新增成功" });
  } catch (error) {
    console.error("addNews error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

exports.getNews = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).send("");

  try {
    const db = getFirestore();
    const {
      category = "",
      page = 1,
      pageSize = 15,
      isPublic = "true",
    } = req.query;

    const pinnedQueryRef = db
      .collection("news")
      .where("isPublic", "==", isPublic === "true")
      .where("isPinned", "==", true);

    const categoryFilteredPinnedQuery = category
      ? pinnedQueryRef.where("category", "==", category)
      : pinnedQueryRef;

    const pinnedQuery = categoryFilteredPinnedQuery.orderBy(
      "created_at",
      "desc"
    );

    const normalQueryRef = db
      .collection("news")
      .where("isPublic", "==", isPublic === "true")
      .where("isPinned", "==", false);

    const categoryFilteredQuery = category
      ? normalQueryRef.where("category", "==", category)
      : normalQueryRef;

    const normalQuery = categoryFilteredQuery
      .orderBy("created_at", "desc")
      .offset((page - 1) * pageSize)
      .limit(Number(pageSize));

    // 查詢 pinned + 非 pinned
    const [pinnedSnap, normalSnap, totalSnap] = await Promise.all([
      pinnedQuery.get(),
      normalQuery.get(),
      categoryFilteredQuery.get(), // 全部非 pinned，拿來計算總數
    ]);

    const pinnedNews = pinnedSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const normalNews = normalSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const total = totalSnap.size;
    const totalPages = Math.ceil(total / pageSize);
    const hasPrev = Number(page) > 1;
    const hasNext = Number(page) < totalPages;

    return res.json({
      success: true,
      message: "取得新聞成功",
      data: {
        pinned: pinnedNews,
        news: normalNews,
        pagination: {
          total,
          totalPages,
          currentPage: Number(page),
          hasPrev,
          hasNext,
        },
      },
    });
  } catch (error) {
    console.error("getNews error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "伺服器錯誤",
    });
  }
});
exports.getArticle = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).send("");

  try {
    const db = getFirestore();
    const articleId = req.path.split("/").pop();

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: "缺少文章 ID",
      });
    }

    const doc = await db.collection("news").doc(articleId).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "查無此文章",
      });
    }

    return res.json({
      success: true,
      message: "取得文章成功",
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error("getArticle error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "伺服器錯誤",
    });
  }
});
