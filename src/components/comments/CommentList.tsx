'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';

type User = {
  name: string;
  image?: string;
};

type Vote = {
  id: string;
  value: number;
  userId: string;
};

type Reply = {
  id: string;
  content: string;
  user: User;
  createdAt: string;
};

type Comment = {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  replies: Reply[];
  votes: Vote[];
};

interface CommentListProps {
  courseId: string;
  lectureId?: string;
}

export const CommentList = ({ courseId, lectureId }: CommentListProps) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;
  const totalPages = Math.ceil(totalCount / pageSize);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showReplyForm, setShowReplyForm] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchComments = async () => {
      const query = new URLSearchParams({
        courseId,
        ...(lectureId ? { lectureId } : {}),
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      const res = await fetch(`/api/comments?${query}`);
      const data = await res.json();
      setComments(data.comments);
      setTotalCount(data.totalCount);
    };

    fetchComments();
  }, [courseId, lectureId, page]);

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment, courseId, lectureId }),
    });

    if (res.ok) {
      const added = await res.json();
      setComments((prev) => [added, ...prev]);
      setNewComment('');
    }

    setLoading(false);
  };

  const handleReplySubmit = async (parentId: string) => {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: replyText[parentId],
        parentId,
        courseId,
        lectureId,
      }),
    });

    if (res.ok) {
      const newReply = await res.json();

      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies ?? []), newReply] }
            : c
        )
      );

      setReplyText((prev) => ({ ...prev, [parentId]: '' }));
      setShowReplyForm((prev) => ({ ...prev, [parentId]: false }));
    }
  };

  const handleVote = async (commentId: string, value: number) => {
    await fetch('/api/comment-votes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentId, value }),
    });

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              votes: [
                ...(c.votes || []).filter((v) => v.userId !== session?.user.id),
                { id: 'temp', userId: session!.user.id, value },
              ],
            }
          : c
      )
    );
  };

  const renderText = (text: string, id: string) => {
    const isLong = text.length > 200;
    const isExpanded = expanded[id];
    if (!isLong) return <div>{text}</div>;

    return (
      <div>
        {isExpanded ? text : text.slice(0, 200) + '...'}
        <button
          onClick={() => toggleExpanded(id)}
          className="ml-2 text-sm text-blue-500"
        >
          {isExpanded ? 'Скрыть' : 'Читать далее'}
        </button>
      </div>
    );
  };

  const renderPagination = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={clsx(
            'px-2 py-1 border text-sm',
            i === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
          )}
        >
          {i}
        </button>
      );
    }
    return <div className="flex gap-2 mt-4">{buttons}</div>;
  };

  if (!session?.user)
    return (
      <p className="italic text-gray-600">
        Только подписчики могут оставлять комментарии.
      </p>
    );

  return (
    <div className="mt-6 space-y-6">
      <h3 className="text-lg font-semibold">Комментарии</h3>

      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border rounded p-2"
        rows={3}
        placeholder="Напишите комментарий..."
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Отправка...' : 'Отправить'}
      </button>

      {comments.map((c) => {
        const likes = (c.votes || []).filter((v) => v.value === 1).length;
        const dislikes = (c.votes || []).filter((v) => v.value === -1).length;
        const userVote = (c.votes || []).find((v) => v.userId === session?.user.id)?.value;

        return (
          <div key={c.id} className="shadow-md p-4 rounded">
            <p className="font-medium">{c.user.name}</p>
            <p className="text-sm text-gray-600">{new Date(c.createdAt).toLocaleString()}</p>
            <div className="mt-1">{renderText(c.content, c.id)}</div>

            <div className="flex gap-4 mt-1 text-sm text-gray-600">
              <button
                className={clsx(userVote === 1 && 'text-blue-500')}
                onClick={() => handleVote(c.id, userVote === 1 ? 0 : 1)}
              >
                👍 {likes}
              </button>
              <button
                className={clsx(userVote === -1 && 'text-red-500')}
                onClick={() => handleVote(c.id, userVote === -1 ? 0 : -1)}
              >
                👎 {dislikes}
              </button>
            </div>

            <button
              onClick={() =>
                setShowReplyForm((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
              }
              className="text-sm text-gray-500 underline mt-1"
            >
              {showReplyForm[c.id] ? 'Отменить' : 'Ответить'}
            </button>

            {showReplyForm[c.id] && (
              <div className="mt-2 pl-4">
                <textarea
                  rows={2}
                  placeholder="Ответить..."
                  value={replyText[c.id] || ''}
                  onChange={(e) =>
                    setReplyText((prev) => ({ ...prev, [c.id]: e.target.value }))
                  }
                  className="w-full border rounded p-2 text-sm"
                />
                <button
                  onClick={() => handleReplySubmit(c.id)}
                  className="bg-gray-200 text-sm px-3 py-1 rounded mt-1"
                >
                  Отправить
                </button>
              </div>
            )}

            {/* Ответы */}
            {c.replies?.map((reply) => (
              <div
                key={reply.id}
                className="pl-4 mt-3 border-l-2 border-gray-300 ml-2"
              >
                <p className="font-medium">{reply.user.name}</p>
                <p className="text-sm text-gray-600">{new Date(reply.createdAt).toLocaleString()}</p>
                <div className="mt-1 text-sm">{renderText(reply.content, reply.id)}</div>
              </div>
            ))}
          </div>
        );
      })}

      {renderPagination()}
    </div>
  );
};
