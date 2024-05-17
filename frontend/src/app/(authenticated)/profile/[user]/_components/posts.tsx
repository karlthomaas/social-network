import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { Post } from '@/components/post/post';
export const ProfilePosts = ({ username }: { username: string }) => {
  const { isLoading, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetcher(`/api/users/${username}/posts`),
  });

  if (isLoading) {
    return (
      <div className='flex flex-col space-y-5'>
        <Post isLoading={true} />
        <Post  isLoading={true} />
        <Post  isLoading={true} />
      </div>
    );
  }

  if (data) {
    return (
      <div className='flex flex-col space-y-5 '>
        {data.posts.map((post: any) => (
          <Post key={post.id} postData={post} isLoading={false} />
        ))}
      </div>
    );
  }
};
