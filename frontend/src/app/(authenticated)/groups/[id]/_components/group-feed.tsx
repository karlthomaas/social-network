import { Post, PostType } from '@/components/post/post';

export const GroupFeed = ({ posts, userId }: { posts: PostType[]; groupId: string; userId: string | undefined }) => {
  return (
    <div className='flex flex-col space-y-3'>
      {posts.map((post) => (
        <Post key={post.id} isLoading={false} postData={post} isAuthor={post.user_id === userId} />
      ))}
    </div>
  );
};
