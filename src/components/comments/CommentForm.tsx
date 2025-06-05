"use client";
import { useState } from "react";

export function CommentForm({ courseId, lectureId, parentId, onSubmit }: any) {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) return;
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ courseId, lectureId, parentId, content }),
    });
    if (res.ok) {
      const comment = await res.json();
      onSubmit(comment);
      setContent("");
    }
  };

  return (
    <div className="mt-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded"
        placeholder="Напишите комментарий..."
      />
      <button onClick={handleSubmit} className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">
        Отправить
      </button>
    </div>
  );
}
