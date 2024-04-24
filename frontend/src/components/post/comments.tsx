import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { LoadingSpinner } from '../ui/spinners';

interface Reply {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export const Comments = ({ post_id }: { post_id: string }) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['comments', post_id],
    queryFn: () => fetcher(`/api/posts/${post_id}/reply`),
  });

  if (isLoading) {
    return (
      <div className='mx-auto my-4 w-max'>
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return <p className='mb-3 text-center text-neutral-300'>Failed to load comments</p>;
  }

  if (data.replies.length === 0) {
    return <p className='mb-3 text-center text-neutral-300'>No comments yet</p>;
  }

  return (
    <div className='mb-5 flex flex-col space-y-3 pt-5'>
      {data.replies.map((reply: Reply) => (
        <div key={reply.id} className=' flex space-x-6'>
          <div id='pfp' className='size-[40px] rounded-full bg-secondary ' />
          <div className='flex flex-col space-y-1'>
            <div className='flex flex-col rounded-xl bg-secondary p-2'>
              <h1 className='font-medium'>{reply.user_id}</h1>
              <p>{reply.content}</p>
            </div>
            <div className='flex space-x-2'>
              <div>Like</div>
              <div>Reply</div>
            </div>
          </div>
        </div>
      ))}
      {/* {comments.map((comment: any) => (
            <div key={comment.id} className='flex space-x-3'>
            <div className='w-10 h-10 bg-blue-900 rounded-full'></div>
            <div className='flex flex-col space-y-1'>
                <div className='flex items-center space-x-2'>
                <p className='font-bold'>{comment.username}</p>
                <p className='text-gray-500 text-sm'>{comment.date}</p>
                </div>
                <p>{comment.body}</p>
            </div>
            </div>
        ))} */}
    </div>
  );
};
