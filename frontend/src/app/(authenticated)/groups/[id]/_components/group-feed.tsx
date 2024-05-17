import { Post, PostType } from '@/components/post/post';

export const GroupFeed = ({ posts }: { posts: PostType[]; groupId: string }) => {
  return (
    <div className='flex flex-col space-y-3'>
      {posts.map((post) => (
        <Post key={post.id} isLoading={false} postData={post} />
      ))}
    </div>
  );
};
