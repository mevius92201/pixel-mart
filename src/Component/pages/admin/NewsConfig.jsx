import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "../../../assets/editor.css";

const categoryOptions = [
  { value: "announcement", label: "公告" },
  { value: "update", label: "更新" },
  { value: "event", label: "活動" },
];

function NewsConfig() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("announcement");
  const [imageFile, setImageFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [bannerURL, setBannerURL] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [content, setContent] = useState("");
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  const uploadImage = async (file, folder = "news_images") => {
    if (!file) return "";
    try {
      setIsUploading(true);
      const storage = getStorage();
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err) {
      alert("圖片上傳失敗：" + err.message);
      return "";
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || !category) {
      alert("請填寫必要欄位");
      return;
    }

    const image = imageURL || (await uploadImage(imageFile, "news_images"));
    const banner = bannerURL || (await uploadImage(bannerFile, "news_banners"));

    try {
      const response = await fetch("https://addnews-3xt565hwvq-uc.a.run.app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          image,
          banner,
          category,
          isPublic,
          isPinned,
          content,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      alert("新增成功！");
      setTitle("");
      setSummary("");
      setCategory("announcement");
      setImageFile(null);
      setBannerFile(null);
      setImageURL("");
      setBannerURL("");
      setIsPublic(true);
      setIsPinned(false);
      editor?.commands.clearContent();
    } catch (err) {
      alert("上傳失敗：" + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", height: "100%" }}>
      <h2 className="title-txt">新增新聞</h2>

      <label>標題：</label>
      <input
        type="text"
        placeholder="輸入新聞標題"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: "1rem" }}
      />

      <label>摘要：</label>
      <textarea
        placeholder="輸入摘要"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={3}
        style={{ width: "100%", padding: 8, marginBottom: "1rem" }}
      />

      <label>分類：</label>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: "1rem" }}
      >
        {categoryOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label>內文圖上傳</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        style={{ marginBottom: "1rem" }}
      />
      <label>連結：</label>
      <input
        type="url"
        placeholder="https://cdn.example.com/your-image.jpg"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "8px" }}
      />
      {imageFile && (
        <img
          src={URL.createObjectURL(imageFile)}
          alt="預覽"
          style={{
            width: "100%",
            maxHeight: 250,
            objectFit: "contain",
            marginBottom: "1rem",
          }}
        />
      )}

      <label>封面用圖</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
        style={{ marginBottom: "1rem" }}
      />
      <label>連結：</label>
      <input
        type="url"
        placeholder="https://cdn.example.com/your-image.jpg"
        value={imageURL}
        onChange={(e) => setImageURL(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "8px" }}
      />
      {bannerFile && (
        <img
          src={URL.createObjectURL(bannerFile)}
          alt="預覽"
          style={{
            width: "100%",
            maxHeight: 250,
            objectFit: "contain",
            marginBottom: "1rem",
          }}
        />
      )}

      <label>是否公開：</label>
      <div style={{ marginBottom: "1rem" }}>
        <label className="radio-label">
          <input
            type="radio"
            name="public"
            style={{ width: "fit-content" }}
            checked={isPublic === true}
            onChange={() => setIsPublic(true)}
          />{" "}
          是
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="public"
            style={{ width: "fit-content" }}
            checked={isPublic === false}
            onChange={() => setIsPublic(false)}
          />{" "}
          否
        </label>
      </div>

      <label className="pinned-label">
        <input
          type="checkbox"
          checked={isPinned}
          style={{ width: "fit-content" }}
          onChange={(e) => setIsPinned(e.target.checked)}
        />
        設為置頂文章
      </label>

      <div style={{ margin: "1rem 0" }}>
        <label>新聞內文：</label>

        {editor && (
          <div className="editor-toolbar" style={{ marginBottom: "0.5rem" }}>
            <button onClick={() => editor.chain().focus().toggleBold().run()}>
              粗體
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              H2
            </button>
            <button onClick={() => editor.chain().focus().setParagraph().run()}>
              段落
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              無序清單
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              有序清單
            </button>
          </div>
        )}
        <div
          className="editor border p-2 rounded-md"
          style={{ border: "1px solid #ccc" }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isUploading}
        style={{
          marginTop: "1rem",
          padding: "10px 20px",
          background: isUploading ? "#aaa" : "#333",
          color: "white",
          borderRadius: "4px",
        }}
      >
        {isUploading ? "上傳中..." : "上傳新聞"}
      </button>
    </div>
  );
}

export default NewsConfig;
