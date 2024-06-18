import { Replies, ReplyType } from '@/components/post/replies';
import { ReplyInput } from '@/components/post/reply-input';
import { useGetPostRepliesQuery } from '@/services/backend/actions/replies';
import { useEffect, useState } from 'react';

export const PostReply = ({ postId }: { postId: string }) => {
  const { isLoading, isError, data } = useGetPostRepliesQuery(postId);
  const [replies, setReplies] = useState<ReplyType[]>([]);

  useEffect(() => {
    if (data?.replies) {
      setReplies(data.replies);
    }
  }, [data?.replies]);

  const handleReplyCallback = (reply: ReplyType, type: 'create' | 'edit') => {
    if (type === 'create') {
      setReplies((replies) => [...replies, reply]);
    } else {
      setReplies((replies) => replies.map((r) => (r.id === reply.id ? reply : r)));
    }
  };

  return (
    <>
      <Replies postId={postId} replies={replies} />
      <ReplyInput postId={postId} callback={handleReplyCallback} />
    </>
  );
};
