import { Post } from '@/components/post/post';
import { useGetUserPostsQuery } from '@/services/backend/actions/posts';

export const ProfilePosts = ({ username }: { username: string }) => {
  const { isLoading, data } = useGetUserPostsQuery(username);

  if (isLoading) {
    return (
      <div className='flex flex-col space-y-5'>
        <Post isLoading={true} />
        <Post isLoading={true} />
        <Post isLoading={true} />
      </div>
    );
  }

  if (data) {
    return (
      <div className='flex flex-col space-y-5 '>
        {
        data.posts.length === 0 ? (
          <h1 className='text-neutral-500 text-xl text-center mt-2'>Feed is empty</h1>
        ) : 
        data.posts.map((post: any) => (
          <Post key={post.id} postData={post} isLoading={false} />
        ))}
      </div>
    );
  }
};
