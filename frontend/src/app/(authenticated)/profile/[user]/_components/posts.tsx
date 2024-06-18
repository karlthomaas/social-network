import { Post, PostType } from '@/components/post/post';

export const ProfilePosts = ({ posts, isAuthor, isLoading }: { posts: PostType[]; isAuthor: boolean; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className='flex flex-col space-y-5'>
        <Post isLoading={true} isAuthor />
        <Post isLoading={true} isAuthor />
        <Post isLoading={true} isAuthor />
      </div>
    );
  }

  if (posts) {
    return (
      <div className='flex flex-col space-y-5 '>
        {posts.length === 0 ? (
          <h1 className='mt-2 text-center text-xl text-neutral-500'>Feed is empty</h1>
        ) : (
          posts.map((post: any) => <Post isAuthor={isAuthor} key={post.id} postData={post} isLoading={false} />)
        )}
      </div>
    );
  }
};
