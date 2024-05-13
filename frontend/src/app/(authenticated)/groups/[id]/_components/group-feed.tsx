import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetchers';
import { Post, PostType } from '@/components/post/post';

interface GroupFeedResponse {
  group_posts: PostType[];
}

export const GroupFeed = ({ groupId }: { groupId: string }) => {
  const { data, isLoading, isError } = useQuery<GroupFeedResponse>({
    queryKey: ['group-feed', groupId],
    queryFn: () => fetcher(`/api/groups/${groupId}/posts`),
  });
  return <div className='flex flex-col'>{data?.group_posts.map((post) => <Post key={post.id} isLoading={false} post={post} />)}</div>;
};
