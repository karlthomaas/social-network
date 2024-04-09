"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetchers";
import { Banner } from "./_components/banner";
import { ProfilePicture } from "./_components/pfp";
import { UserDetails } from "./_components/user-details";
import { ProfilePosts } from "./_components/posts";

export default function Profile({ params }: { params: { user: string } }) {

  const postsMutation = useQuery({
    queryKey: ['posts', params.user],
    queryFn: () => fetcher(`/api/users/${params.user}/posts`),
  });

  
  return (
    <div>
      <Banner />
    <UserDetails username={params.user} />
      <ProfilePosts username={params.user} />
    </div>
  );
}
